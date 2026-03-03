import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Polar + Encore</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; border-radius: 12px; padding: 2.5rem; max-width: 480px; width: 100%; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #666; margin-bottom: 1.5rem; font-size: 0.9375rem; line-height: 1.5; }
    label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; }
    input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9375rem; margin-bottom: 1rem; font-family: inherit; }
    button { width: 100%; padding: 0.75rem; background: #111; color: white; border: none; border-radius: 8px; font-size: 0.9375rem; font-weight: 500; cursor: pointer; }
    button:hover { background: #333; }
    button:disabled { background: #999; cursor: not-allowed; }
    .status { margin-top: 1rem; padding: 0.75rem; border-radius: 8px; font-size: 0.875rem; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .info { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.75rem; margin-bottom: 1.5rem; font-size: 0.8125rem; color: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Checkout with Polar</h1>
    <p>Create a checkout session to redirect your customer to Polar's hosted payment page.</p>
    <div class="info">
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
