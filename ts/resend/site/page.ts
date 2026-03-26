import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resend + Encore</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #EEEEE1; color: #111111; line-height: 1.6; }
    .wrap { max-width: 960px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; letter-spacing: -0.02em; }
    .subtitle { color: #666; margin-bottom: 24px; font-size: 14px; }
    .layout { display: flex; gap: 32px; }
    .main { flex: 1; min-width: 0; }
    .sidebar { width: 260px; flex-shrink: 0; align-self: flex-start; position: sticky; top: 40px; }
    .card { background: #fff; border: 1px solid #ccc; padding: 20px; margin-bottom: 16px; }
    .card h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600; }
    .info { border: 1px solid #ccc; padding: 16px; font-size: 12px; line-height: 1.7; background: #fff; }
    .info h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 6px; margin-top: 14px; }
    .info h3:first-child { margin-top: 0; }
    .info p { color: #555; margin-bottom: 8px; }
    .info code { background: #EEEEE1; padding: 1px 4px; font-size: 11px; }
    .info ul { padding-left: 14px; color: #555; margin-bottom: 8px; }
    .info li { margin-bottom: 2px; }
    .info a { color: #4651FF; text-decoration: none; }
    .info a:hover { text-decoration: underline; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
    input, textarea { width: 100%; padding: 7px 10px; border: 1px solid #ccc; font-size: 13px; margin-bottom: 6px; background: #fff; font-family: inherit; }
    textarea { resize: vertical; min-height: 80px; }
    button { background: #111; color: #EEEEE1; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; font-weight: 500; width: 100%; }
    button:hover { background: #333; }
    button:disabled { background: #999; cursor: not-allowed; }
    .status { margin-top: 10px; padding: 10px; font-size: 12px; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    @media (max-width: 768px) { .layout { flex-direction: column; } .sidebar { width: 100%; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Resend + Encore</h1>
    <p class="subtitle">Transactional email with async delivery</p>
    <div class="layout">
      <div class="main">
        <div class="card">
          <h2>Send an Email</h2>
          <form id="form">
            <label for="to">To</label>
            <input type="email" id="to" name="to" placeholder="recipient@example.com" required>
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="Hello from Encore!" required>
            <label for="html">Body (HTML)</label>
            <textarea id="html" name="html" placeholder="<p>Hello! This email was sent with Resend + Encore.</p>" required></textarea>
            <button type="submit">Send email</button>
          </form>
          <div id="status" class="status"></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="info">
          <h3>What is Resend?</h3>
          <p><a href="https://resend.com">Resend</a> is a modern email API built for developers. Designed for transactional email with high deliverability and a simple integration model.</p>
          <h3>How it works</h3>
          <p>The email service wraps Resend's API. Encore manages the API key as a secret, keeping credentials out of your code.</p>
          <h3>Encore integration</h3>
          <ul>
            <li>Secret management for API keys</li>
            <li>Structured logging for email events</li>
          </ul>
          <h3>Next steps</h3>
          <ul>
            <li>Add email templates</li>
            <li>Set up webhooks for delivery tracking</li>
            <li>Add Pub/Sub for async email processing</li>
            <li>Deploy to production</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const status = document.getElementById('status');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      status.className = 'status';

      try {
        const res = await fetch('/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: document.getElementById('to').value,
            subject: document.getElementById('subject').value,
            html: document.getElementById('html').value,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          status.textContent = data.message;
          status.className = 'status success';
        } else {
          status.textContent = data.message || 'Something went wrong';
          status.className = 'status error';
        }
      } catch (err) {
        status.textContent = 'Failed to send request';
        status.className = 'status error';
      }
      btn.disabled = false;
      btn.textContent = 'Send email';
    });
  </script>
</body>
</html>`;

export const page = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  }
);
