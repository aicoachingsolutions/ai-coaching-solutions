import { NextResponse } from "next/server";
import { z } from "zod";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const RequestSchema = z.object({
  sport: z.string().min(1),
  motion: z.string().min(1),
  ageGroup: z.string().optional().default(""),
  skillLevel: z.string().optional().default(""),
  mainIssue: z.string().min(1),

  result: z.object({
    mechanics: z.string().min(1),
    timing: z.string().min(1),
    cues: z.array(z.string()).min(1),
    nextFocus: z.string().min(1),
    drill: z.string().min(1),
  }),
});

type Payload = z.infer<typeof RequestSchema>;

function wrapLines(text: string, maxChars = 95) {
  const words = (text || "").replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxChars) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function section(docLines: string[], title: string, body: string | string[]) {
  docLines.push(title.toUpperCase());
  docLines.push("");

  if (Array.isArray(body)) {
    for (const item of body) {
      docLines.push(`• ${item}`);
    }
  } else {
    const wrapped = wrapLines(body);
    docLines.push(...wrapped);
  }

  docLines.push("");
  docLines.push("");
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data: Payload = parsed.data;

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]); // US Letter
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const marginX = 54;
    const marginTop = 54;
    const lineHeight = 14;
    const titleSize = 18;
    const textSize = 11;
    const minY = 72;
    const footerY = 30;
    const footerText = "AI Coaching Solutions — Built by a Coach";

    let y = 792 - marginTop;

    const drawFooter = (targetPage: typeof page) => {
      targetPage.drawText(footerText, {
        x: marginX,
        y: footerY,
        size: 9,
        font,
        color: rgb(0.43, 0.48, 0.55),
      });
    };

    drawFooter(page);

    const drawLine = (text: string, opts?: { bold?: boolean; size?: number }) => {
      const size = opts?.size ?? textSize;
      const f = opts?.bold ? fontBold : font;

      page.drawText(text, {
        x: marginX,
        y,
        size,
        font: f,
        color: rgb(0.05, 0.07, 0.1),
      });

      y -= lineHeight;
    };

    const ensureSpace = (requiredLines = 1) => {
      if (y - requiredLines * lineHeight >= minY) return;
      page = pdfDoc.addPage([612, 792]);
      y = 792 - marginTop;
      drawFooter(page);
    };

    // Header
    drawLine("Coaching Breakdown", { bold: true, size: titleSize });
    y -= 6;

    const meta = [
      `Sport: ${data.sport}`,
      `Motion: ${data.motion}`,
      data.ageGroup ? `Age group: ${data.ageGroup}` : "",
      data.skillLevel ? `Skill level: ${data.skillLevel}` : "",
    ].filter(Boolean);

    for (const m of meta) {
      ensureSpace();
      drawLine(m);
    }
    y -= 6;

    // Divider
    page.drawLine({
      start: { x: marginX, y: y + 6 },
      end: { x: 612 - marginX, y: y + 6 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });
    y -= 12;

    // Build text lines
    const lines: string[] = [];
    section(lines, "What they're seeing", data.mainIssue);
    section(lines, "Mechanics", data.result.mechanics);
    section(lines, "Timing", data.result.timing);
    section(lines, "Coaching cues", data.result.cues);
    section(lines, "Next focus", data.result.nextFocus);
    section(lines, "Recommended drill", data.result.drill);

    // Render lines with pagination
    for (const raw of lines) {
      if (!raw) {
        ensureSpace();
        y -= lineHeight;
        continue;
      }

      const wrapped = wrapLines(raw, 105);
      for (const w of wrapped) {
        ensureSpace();
        drawLine(w);
      }
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="coaching-breakdown.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
