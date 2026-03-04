import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const host = process.env.EMAIL_SERVER_HOST ?? process.env.SMTP_HOST;
  const port = Number(process.env.EMAIL_SERVER_PORT ?? process.env.SMTP_PORT);
  const secure =
    (process.env.EMAIL_SERVER_SECURE ?? process.env.SMTP_SECURE) === "true";
  const user = process.env.EMAIL_SERVER_USER ?? process.env.SMTP_USER;
  const pass = (process.env.EMAIL_SERVER_PASSWORD ?? process.env.SMTP_PASS ?? "").replace(
    /\s+/g,
    ""
  );

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
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "New Coaching Notes Signup",
    text: body.email,
  });

  return Response.json({ success: true });
}
