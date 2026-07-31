import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/smtp-config";
import { buildWaitlistConfirmationText } from "@/lib/waitlist-email-copy";

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
    const coachingAudience = String(body?.coachingAudience ?? "").trim();
    const sport = String(body?.sport ?? "").trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const { host, port, secure, user, pass, from, to, missing } = getSmtpConfig();

    if (!email || !email.includes("@")) {
      return Response.json({ success: false, error: "Invalid email." }, { status: 400 });
    }
    if (submissionType === "contact" && !message) {
      return Response.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    if (missing.length > 0) {
      console.error("[api/contact] missing email env:", missing.join(", "));
      return Response.json(
        {
          success: false,
          error: "Email is temporarily unavailable. Please try again in a few minutes.",
          code: "email_not_configured",
        },
        { status: 503 }
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

    if (submissionType === "contact") {
      const detailsLines = [
        `Type: contact`,
        `Source: ${source}`,
        `Email: ${email}`,
        fullName ? `Name: ${fullName}` : "",
        `Message: ${message}`,
      ].filter(Boolean);

      await transporter.sendMail({
        from,
        to,
        subject: "New Contact Form Message",
        text: detailsLines.join("\n"),
      });

      await transporter.sendMail({
        from,
        to: email,
        subject: "We received your message - AI Coaching Solutions",
        text: [
          `Hi ${firstName || "there"},`,
          "",
          "Thanks for reaching out. We received your message and will follow up as soon as we can.",
          "",
          "Your message:",
          message,
          "",
          "AI Coaching Solutions",
        ].join("\n"),
      });

      return Response.json({ success: true });
    }

    // waitlist + legacy signup
    const waitlistCopy = buildWaitlistConfirmationText(source, email, firstName || undefined, {
      coachingAudience: coachingAudience || undefined,
      sport: sport || undefined,
    });

    await transporter.sendMail({
      from,
      to,
      subject: waitlistCopy.internalSubject,
      text: waitlistCopy.internalText,
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: waitlistCopy.subject,
      text: waitlistCopy.text,
    });

    return Response.json({ success: true });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[api/contact] send failed:", detail);

    const authFailed = /invalid login|badcredentials|535|authentication failed/i.test(detail);
    return Response.json(
      {
        success: false,
        error: authFailed
          ? "Email delivery is temporarily unavailable. Please try again later."
          : "We couldn't send email right now. Please try again in a few minutes.",
        code: authFailed ? "email_auth_failed" : "email_send_failed",
      },
      { status: 503 }
    );
  }
}
