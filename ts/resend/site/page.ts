import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resend + Encore</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; border-radius: 12px; padding: 2.5rem; max-width: 480px; width: 100%; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #666; margin-bottom: 1.5rem; font-size: 0.9375rem; line-height: 1.5; }
    label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; }
    input, textarea { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9375rem; margin-bottom: 1rem; font-family: inherit; }
    textarea { resize: vertical; min-height: 80px; }
    button { width: 100%; padding: 0.75rem; background: #111; color: white; border: none; border-radius: 8px; font-size: 0.9375rem; font-weight: 500; cursor: pointer; }
    button:hover { background: #333; }
    button:disabled { background: #999; cursor: not-allowed; }
    .status { margin-top: 1rem; padding: 0.75rem; border-radius: 8px; font-size: 0.875rem; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Send an email</h1>
    <p>This sends an email asynchronously via Encore Pub/Sub and Resend. The API returns immediately while the email is delivered in the background.</p>
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
