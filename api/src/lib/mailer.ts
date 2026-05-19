import { Resend } from 'resend';

let _resend: Resend | null = null;
const getResend = () => {
    if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
    return _resend;
};

const FROM = () => process.env.EMAIL_FROM ?? 'InnebandyLab <noreply@resend.dev>';

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async (opts: MailOptions): Promise<void> => {
    if (!process.env.RESEND_API_KEY) {
        console.log(`[mailer] No RESEND_API_KEY — skipping email to ${opts.to}: ${opts.subject}`);
        return;
    }
    const { error } = await getResend().emails.send({ from: FROM(), ...opts });
    if (error) throw new Error(`Resend error: ${error.message}`);
};

// ── HTML templates ──────────────────────────────────────────────────────────

const base = (content: string) => `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>InnebandyLab</title>
</head>
<body style="margin:0;padding:0;background:#0f1012;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e8eaed">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#16181a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden">
        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid rgba(255,255,255,0.07)">
            <span style="font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#e8eaed">InnebandyLab</span>
            <span style="margin-left:8px;background:#c9f24f;color:#0f1012;font-size:9px;font-weight:700;letter-spacing:0.06em;padding:2px 7px;border-radius:20px;text-transform:uppercase;vertical-align:middle">Beta</span>
          </td>
        </tr>
        <tr><td style="padding:32px">${content}</td></tr>
        <tr>
          <td style="padding:16px 32px 24px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(232,234,237,0.4);text-align:center">
            InnebandyLab · Det här mejlet skickades automatiskt, svara inte på det.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const rsvpEmail = (opts: {
    playerName: string;
    sessionTitle: string;
    teamName?: string;
    dateStr?: string;
    timeStr?: string;
    rsvpUrl: string;
}) => base(`
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.08em;color:rgba(232,234,237,0.45);text-transform:uppercase">Närvaro</p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#e8eaed;line-height:1.2">${opts.sessionTitle}</h1>

  ${opts.teamName ? `<p style="margin:0 0 4px;font-size:13px;color:rgba(232,234,237,0.55)">Lag: <strong style="color:#e8eaed">${opts.teamName}</strong></p>` : ''}
  ${opts.dateStr ? `<p style="margin:0 0 4px;font-size:13px;color:rgba(232,234,237,0.55)">Datum: <strong style="color:#e8eaed">${opts.dateStr}</strong></p>` : ''}
  ${opts.timeStr ? `<p style="margin:0 0 4px;font-size:13px;color:rgba(232,234,237,0.55)">Tid: <strong style="color:#e8eaed">${opts.timeStr}</strong></p>` : ''}

  <p style="margin:24px 0 8px;font-size:14px;color:#e8eaed">Hej ${opts.playerName},</p>
  <p style="margin:0 0 24px;font-size:14px;color:rgba(232,234,237,0.7);line-height:1.6">
    Kan du komma till träningen? Klicka på knappen nedan för att svara.
  </p>

  <a href="${opts.rsvpUrl}" style="display:inline-block;background:#c9f24f;color:#0f1012;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em">
    Svara på inbjudan →
  </a>

  <p style="margin:20px 0 0;font-size:11px;color:rgba(232,234,237,0.35)">Eller kopiera länken: ${opts.rsvpUrl}</p>
`);

export const clubInviteEmail = (opts: {
    inviterName: string;
    clubName: string;
    role: string;
    inviteUrl: string;
}) => {
    const roleLabel: Record<string, string> = { admin: 'Administratör', coach: 'Tränare', assistant: 'Assistent' };
    return base(`
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.08em;color:rgba(232,234,237,0.45);text-transform:uppercase">Klubbinbjudan</p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#e8eaed;line-height:1.2">${opts.clubName}</h1>

  <p style="margin:0 0 24px;font-size:14px;color:rgba(232,234,237,0.7);line-height:1.6">
    <strong style="color:#e8eaed">${opts.inviterName}</strong> bjuder in dig att gå med i
    <strong style="color:#e8eaed">${opts.clubName}</strong> på InnebandyLab
    som <strong style="color:#e8eaed">${roleLabel[opts.role] ?? opts.role}</strong>.
  </p>

  <a href="${opts.inviteUrl}" style="display:inline-block;background:#c9f24f;color:#0f1012;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em">
    Acceptera inbjudan →
  </a>

  <p style="margin:20px 0 0;font-size:11px;color:rgba(232,234,237,0.35)">Länken är giltig i 7 dagar. Eller kopiera: ${opts.inviteUrl}</p>
`);
};
