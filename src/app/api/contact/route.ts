import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const host = process.env.EMAIL_SERVER_HOST ?? process.env.SMTP_HOST;
    const rawPort = process.env.EMAIL_SERVER_PORT ?? process.env.SMTP_PORT;
    const port = Number(rawPort ?? 465);
    const secure =
      (process.env.EMAIL_SERVER_SECURE ?? process.env.SMTP_SECURE) === "true";
    const user = process.env.EMAIL_SERVER_USER ?? process.env.SMTP_USER;
    const pass = (process.env.EMAIL_SERVER_PASSWORD ?? process.env.SMTP_PASS ?? "").replace(
      /\s+/g,
      ""
    );
    const from = process.env.EMAIL_FROM ?? user;
    const to = process.env.EMAIL_TO ?? user;

    if (!email || !email.includes("@")) {
      return Response.json({ success: false, error: "Invalid email." }, { status: 400 });
    }

    const missing: string[] = [];
    if (!host) missing.push("EMAIL_SERVER_HOST|SMTP_HOST");
    if (Number.isNaN(port)) missing.push("EMAIL_SERVER_PORT|SMTP_PORT");
    if (!user) missing.push("EMAIL_SERVER_USER|SMTP_USER");
    if (!pass) missing.push("EMAIL_SERVER_PASSWORD|SMTP_PASS");
    if (!from) missing.push("EMAIL_FROM (or fallback user)");
    if (!to) missing.push("EMAIL_TO (or fallback user)");

    if (missing.length > 0) {
      return Response.json(
        {
          success: false,
          error: `Email service is not configured. Missing: ${missing.join(", ")}`,
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject: "New Coaching Notes Signup",
      text: `Email: ${email}`,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Could not send right now. Please try again." },
      { status: 500 }
    );
  }
}
