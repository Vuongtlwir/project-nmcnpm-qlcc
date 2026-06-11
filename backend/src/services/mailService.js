const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  return transporter;
};

const sendMail = async ({ to, subject, html }) => {
  const t = getTransporter();

  if (!t) {
    console.log('========================================');
    console.log(`[MAIL] To: ${to}`);
    console.log(`[MAIL] Subject: ${subject}`);
    console.log(`[MAIL] Body:\n${html.replace(/<[^>]*>/g, '')}`);
    console.log('========================================');
    return { sent: false, reason: 'SMTP not configured, printed to console' };
  }

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM || SMTP_USER,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[MAIL] Send failed:', err.message);
    return { sent: false, reason: err.message };
  }
};

const sendNewAccountEmail = async ({ email, username, password, fullName }) => {
  const subject = 'Tài khoản quản lý chung cư';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #2563eb, #60a5fa); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700;">NM</div>
      </div>
      <h1 style="font-size: 1.3rem; color: #0f172a; margin: 0 0 8px; text-align: center;">Chào mừng bạn đến với Nova Management</h1>
      <p style="color: #475569; font-size: 0.9rem; text-align: center; margin: 0 0 24px;">Tài khoản quản lý chung cư của bạn đã được tạo.</p>

      <div style="background: white; border-radius: 12px; padding: 20px 24px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 4px; color: #64748b; font-size: 0.85rem;">Xin chào <strong>${fullName}</strong>,</p>
        <p style="margin: 0 0 16px; color: #475569; font-size: 0.85rem;">Tài khoản của bạn đã được tạo thành công. Vui lòng sử dụng thông tin sau để đăng nhập:</p>

        <table style="width: 100%; font-size: 0.88rem;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 120px;">Tên đăng nhập:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-family: monospace; font-size: 1rem;">${username}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Mật khẩu:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0f172a; font-family: monospace; font-size: 1rem;">${password}</td>
          </tr>
        </table>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-top: 16px; font-size: 0.82rem; color: #92400e;">
          Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu để bảo mật tài khoản.
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 0.78rem; text-align: center; margin-top: 24px;">Nova Management - Hệ thống quản lý chung cư</p>
    </div>
  `;

  return sendMail({ to: email, subject, html });
};

module.exports = { sendMail, sendNewAccountEmail };
