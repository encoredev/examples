import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polar + Encore</title>
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
    .hint { background: #fff; border: 1px solid #ccc; padding: 10px 12px; margin-bottom: 12px; font-size: 12px; color: #555; line-height: 1.5; }
    .hint a { color: #4651FF; text-decoration: none; }
    .hint a:hover { text-decoration: underline; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
    input { width: 100%; padding: 7px 10px; border: 1px solid #ccc; font-size: 13px; margin-bottom: 6px; background: #fff; font-family: inherit; }
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
    <h1>Polar + Encore</h1>
    <p class="subtitle">Payments and subscriptions with Merchant of Record</p>
    <div class="layout">
      <div class="main">
        <div class="card">
          <h2>Create Checkout</h2>
          <div class="hint">
            You'll need a product ID from your <a href="https://sandbox.polar.sh" target="_blank">Polar Sandbox dashboard</a>. Create a product there first, then copy its product ID.
          </div>
          <form id="form">
            <label for="productId">Product ID</label>
            <input type="text" id="productId" name="productId" placeholder="d35f805e-37f4-..." required>
            <label for="email">Customer email</label>
            <input type="email" id="email" name="email" placeholder="customer@example.com" required>
            <button type="submit">Create checkout</button>
          </form>
          <div id="status" class="status"></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="info">
          <h3>What is Polar?</h3>
          <p><a href="https://polar.sh">Polar</a> is a developer-focused monetization platform for subscriptions and digital products. It acts as Merchant of Record, handling payments and tax on your behalf.</p>
          <h3>How it works</h3>
          <p>The billing service handles checkout sessions and webhooks. Polar manages payments, invoicing, and tax compliance.</p>
          <h3>Encore integration</h3>
          <ul>
            <li>Webhook handling via raw endpoints</li>
            <li>Secret management for API keys</li>
            <li>Pub/Sub for processing payment events</li>
          </ul>
          <h3>Next steps</h3>
          <ul>
            <li>Add subscription tiers</li>
            <li>Set up customer portal</li>
            <li>Add usage-based billing</li>
            <li>Deploy to production</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <script>
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const status = document.getElementById('status');
      status.textContent = 'Payment successful! The webhook will be processed shortly.';
      status.className = 'status success';
    }

    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const status = document.getElementById('status');
      btn.disabled = true;
      btn.textContent = 'Creating checkout...';
      status.className = 'status';

      try {
        const res = await fetch('/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: document.getElementById('productId').value,
            customerEmail: document.getElementById('email').value,
          }),
        });
        const data = await res.json();
        if (res.ok && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          status.textContent = data.message || 'Failed to create checkout';
          status.className = 'status error';
          btn.disabled = false;
          btn.textContent = 'Create checkout';
        }
      } catch (err) {
        status.textContent = 'Failed to send request';
        status.className = 'status error';
        btn.disabled = false;
        btn.textContent = 'Create checkout';
      }
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
