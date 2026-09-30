import nodemailer from "nodemailer";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export type EmailResult = {
  status: "sent" | "logged" | "failed";
  detail: string;
};

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<EmailResult>;
}

class LogEmailProvider implements EmailProvider {
  readonly name = "log";
  async send(message: EmailMessage): Promise<EmailResult> {
    console.info(`[email:log] ${message.to} — ${message.subject}`);
    return { status: "logged", detail: "Fournisseur « log » : e-mail enregistré, non envoyé." };
  }
}

class ResendProvider implements EmailProvider {
  readonly name = "resend";
  async send(message: EmailMessage): Promise<EmailResult> {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) return { status: "failed", detail: "RESEND_API_KEY ou EMAIL_FROM manquant." };
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: message.to, subject: message.subject, text: message.text }),
    });
    if (!response.ok) return { status: "failed", detail: `Resend ${response.status}` };
    return { status: "sent", detail: "Envoyé via Resend." };
  }
}

class SendgridProvider implements EmailProvider {
  readonly name = "sendgrid";
  async send(message: EmailMessage): Promise<EmailResult> {
    const key = process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) return { status: "failed", detail: "SENDGRID_API_KEY ou EMAIL_FROM manquant." };
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: message.to }] }],
        from: { email: from.match(/<([^>]+)>/)?.[1] ?? from },
        subject: message.subject,
        content: [{ type: "text/plain", value: message.text }],
      }),
    });
    if (!response.ok) return { status: "failed", detail: `SendGrid ${response.status}` };
    return { status: "sent", detail: "Envoyé via SendGrid." };
  }
}

class BrevoProvider implements EmailProvider {
  readonly name = "brevo";
  async send(message: EmailMessage): Promise<EmailResult> {
    const key = process.env.BREVO_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!key || !from) return { status: "failed", detail: "BREVO_API_KEY ou EMAIL_FROM manquant." };
    const email = from.match(/<([^>]+)>/)?.[1] ?? from;
    const name = from.replace(/<[^>]+>/, "").trim() || "LD House of Make Up";
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { email, name },
        to: [{ email: message.to }],
        subject: message.subject,
        textContent: message.text,
      }),
    });
    if (!response.ok) return { status: "failed", detail: `Brevo ${response.status}` };
    return { status: "sent", detail: "Envoyé via Brevo." };
  }
}

class SmtpProvider implements EmailProvider {
  readonly name = "smtp";
  async send(message: EmailMessage): Promise<EmailResult> {
    const host = process.env.SMTP_HOST;
    const from = process.env.EMAIL_FROM;
    if (!host || !from) return { status: "failed", detail: "SMTP_HOST ou EMAIL_FROM manquant." };
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    await transport.sendMail({ from, to: message.to, subject: message.subject, text: message.text });
    return { status: "sent", detail: "Envoyé via SMTP." };
  }
}

const providers: Record<string, EmailProvider> = {
  log: new LogEmailProvider(),
  resend: new ResendProvider(),
  sendgrid: new SendgridProvider(),
  brevo: new BrevoProvider(),
  smtp: new SmtpProvider(),
};

export function getEmailProvider() {
  const name = (process.env.EMAIL_PROVIDER || "log").toLowerCase();
  return providers[name] ?? providers.log;
}
