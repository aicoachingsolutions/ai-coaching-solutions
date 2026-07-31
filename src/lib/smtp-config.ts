/**
 * Shared SMTP helpers for contact / breakdown email routes.
 */

export function getSmtpConfig() {
  const host = process.env.EMAIL_SERVER_HOST ?? process.env.SMTP_HOST;
  const rawPort = process.env.EMAIL_SERVER_PORT ?? process.env.SMTP_PORT;
  const port = Number(rawPort ?? 465);
  const secure = (process.env.EMAIL_SERVER_SECURE ?? process.env.SMTP_SECURE) === "true";
  const user = process.env.EMAIL_SERVER_USER ?? process.env.SMTP_USER;
  const pass = (process.env.EMAIL_SERVER_PASSWORD ?? process.env.SMTP_PASS ?? "").replace(
    /\s+/g,
    ""
  );
  const to = process.env.EMAIL_TO ?? user;
  const from = normalizeEmailFrom(process.env.EMAIL_FROM, user);

  const missing: string[] = [];
  if (!host) missing.push("EMAIL_SERVER_HOST|SMTP_HOST");
  if (Number.isNaN(port)) missing.push("EMAIL_SERVER_PORT|SMTP_PORT");
  if (!user) missing.push("EMAIL_SERVER_USER|SMTP_USER");
  if (!pass) missing.push("EMAIL_SERVER_PASSWORD|SMTP_PASS");
  if (!from) missing.push("EMAIL_FROM (or fallback user)");
  if (!to) missing.push("EMAIL_TO (or fallback user)");

  return { host, port, secure, user, pass, from, to, missing };
}

/**
 * Accepts common env mistakes like:
 *   AI Coaching Solutions info@example.com
 * and returns RFC-ish:
 *   "AI Coaching Solutions" <info@example.com>
 */
export function normalizeEmailFrom(
  rawFrom: string | undefined,
  fallbackUser: string | undefined
): string | undefined {
  const raw = (rawFrom ?? "").trim().replace(/^["']|["']$/g, "");
  if (!raw && fallbackUser) return fallbackUser;
  if (!raw) return undefined;

  if (/<[^>]+@[^>]+>/.test(raw)) return raw;

  const match = raw.match(/^(.*?)([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})$/i);
  if (match) {
    const name = match[1].trim().replace(/[<>]/g, "");
    const email = match[2];
    if (name) return `"${name}" <${email}>`;
    return email;
  }

  if (raw.includes("@")) return raw;
  return fallbackUser ?? raw;
}
