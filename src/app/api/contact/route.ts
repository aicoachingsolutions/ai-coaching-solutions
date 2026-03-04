import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const submissionType =
      body?.type === "contact" || body?.type === "waitlist" ? body.type : "signup";
    const source = String(body?.source ?? "homepage");
    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.firstName ?? "").trim();
    const lastName = String(body?.lastName ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
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
    if (submissionType === "contact" && !message) {
      return Response.json({ success: false, error: "Message is required." }, { status: 400 });
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

    const detailsLines = [
      `Type: ${submissionType}`,
      `Source: ${source}`,
      `Email: ${email}`,
      fullName ? `Name: ${fullName}` : "",
      message ? `Message: ${message}` : "",
    ].filter(Boolean);

    const internalSubject =
      submissionType === "contact" ? "New Contact Form Message" : "New Coaching Notes Signup";

    await transporter.sendMail({
      from,
      to,
      subject: internalSubject,
      text: detailsLines.join("\n"),
    });

    const confirmationSubject =
      submissionType === "contact"
        ? "We received your message - AI Coaching Solutions"
        : "You are on the list - AI Coaching Solutions";
    const confirmationText =
      submissionType === "contact"
        ? [
            `Hi ${firstName || "Coach"},`,
            "",
            "Thanks for reaching out. We received your message and will follow up as soon as we can.",
            "",
            "Your message:",
            message || "(No message provided)",
            "",
            "AI Coaching Solutions",
          ].join("\n")
        : [
            `Hi ${firstName || "Coach"},`,
            "",
            "Thanks for joining coaching notes updates.",
            "You will get occasional practical updates when new tools and resources are ready.",
            "",
            "AI Coaching Solutions",
          ].join("\n");

    await transporter.sendMail({
      from,
      to: email,
      subject: confirmationSubject,
      text: confirmationText,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Could not send right now. Please try again." },
      { status: 500 }
    );
  }
}
