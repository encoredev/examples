import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Better Auth + Encore</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #EEEEE1; color: #111111; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem; }
    .page-header { text-align: center; margin-bottom: 2rem; }
    .page-header h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
    .page-header .subtitle { color: #666; font-size: 0.9375rem; }
    .layout { display: flex; gap: 1.5rem; max-width: 720px; width: 100%; align-items: flex-start; }
    .main { flex: 1; min-width: 0; }
    .card { background: #fff; border: 1px solid #ccc; padding: 2rem; }
    .sidebar { width: 260px; flex-shrink: 0; background: #fff; border: 1px solid #ccc; padding: 1.25rem; }
    .sidebar section { margin-bottom: 1.25rem; }
    .sidebar section:last-child { margin-bottom: 0; }
    .sidebar h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 0.5rem; color: #111; }
    .sidebar p, .sidebar li { font-size: 0.8125rem; line-height: 1.5; color: #444; }
    .sidebar ul { padding-left: 1rem; margin: 0; }
    .sidebar li { margin-bottom: 0.25rem; }
    .sidebar a { color: #4651FF; text-decoration: none; }
    .sidebar a:hover { text-decoration: underline; }
    .tabs { display: flex; gap: 0; margin-bottom: 1.5rem; border-bottom: 1px solid #ccc; }
    .tab { flex: 1; padding: 0.625rem; text-align: center; font-size: 0.9375rem; font-weight: 500; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; color: #999; font-family: inherit; }
    .tab.active { color: #111; border-bottom-color: #111; }
    label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; }
    input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #ccc; border-radius: 0; font-size: 0.9375rem; margin-bottom: 1rem; font-family: inherit; background: #fff; }
    input:focus { outline: none; border-color: #111; }
    button.submit { width: 100%; padding: 0.75rem; background: #111; color: #EEEEE1; border: none; border-radius: 0; font-size: 0.9375rem; font-weight: 500; cursor: pointer; font-family: inherit; }
    button.submit:hover { background: #333; }
    button.submit:disabled { background: #999; cursor: not-allowed; }
    .divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.25rem 0; color: #999; font-size: 0.8125rem; }
    .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: #ccc; }
    .social-btn { width: 100%; padding: 0.625rem; background: #fff; border: 1px solid #ccc; border-radius: 0; font-size: 0.9375rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem; font-family: inherit; }
    .social-btn:hover { background: #f5f5f0; }
    .social-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .social-btn svg { width: 18px; height: 18px; }
    .social-btn-wrap { position: relative; }
    .tooltip { display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #111; color: #EEEEE1; font-size: 0.75rem; line-height: 1.4; padding: 0.5rem 0.75rem; border-radius: 0; width: 240px; text-align: center; z-index: 10; pointer-events: none; }
    .tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #111; }
    .social-btn-wrap:hover .tooltip { display: block; }
    .status { margin-top: 1rem; padding: 0.75rem; border-radius: 0; font-size: 0.875rem; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .profile { display: none; text-align: center; }
    .profile h2 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .profile p { color: #666; margin-bottom: 1rem; font-size: 0.9375rem; }
    .profile button { background: none; border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 0; cursor: pointer; font-size: 0.875rem; font-family: inherit; }
    .profile button:hover { background: #f5f5f0; }
    #name-field { display: none; }
    @media (max-width: 680px) {
      .layout { flex-direction: column; }
      .sidebar { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page-header">
    <h1>Better Auth + Encore</h1>
    <p class="subtitle">Sign in or create an account</p>
  </div>

  <div class="layout">
    <div class="main">
      <div class="card">
        <div id="auth-view">
          <div class="social-btn-wrap">
            <div class="tooltip">Uncomment socialProviders in auth/auth.ts and set your GitHub OAuth credentials</div>
            <button class="social-btn" disabled>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <div class="divider">or</div>

          <div class="tabs">
            <button class="tab active" data-tab="signin">Sign in</button>
            <button class="tab" data-tab="signup">Sign up</button>
          </div>
          <form id="form">
            <div id="name-field">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name">
            </div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Your password" required minlength="8">
            <button type="submit" class="submit" id="submit-btn">Sign in</button>
          </form>
          <div id="status" class="status"></div>
        </div>
        <div id="profile-view" class="profile">
          <h2>You're signed in</h2>
          <p id="user-info"></p>
          <button onclick="signOut()">Sign out</button>
        </div>
      </div>
    </div>

    <aside class="sidebar">
      <section>
        <h3>What is Better Auth?</h3>
        <p>An open-source TypeScript authentication framework. Supports email/password, OAuth, two-factor authentication, and ships with a flexible plugin system.</p>
      </section>
      <section>
        <h3>How auth works</h3>
        <p>All Better Auth routes are mounted at <strong>/auth/*</strong>. The backend validates sessions through the auth handler, with support for both cookie-based and Bearer token authentication.</p>
      </section>
      <section>
        <h3>Encore integration</h3>
        <p>Better Auth uses Encore's <strong>SQLDatabase</strong> for storage. The auth handler validates sessions for all protected API endpoints.</p>
      </section>
      <section>
        <h3>Next steps</h3>
        <ul>
          <li><a href="https://www.better-auth.com/docs/concepts/oauth" target="_blank">Add OAuth providers</a></li>
          <li>Enable 2FA</li>
          <li>Add organizations plugin</li>
          <li>Deploy to production</li>
          <li>Generate a type-safe frontend client</li>
        </ul>
      </section>
    </aside>
  </div>

  <script>
    let mode = 'signin';

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('name-field').style.display = mode === 'signup' ? 'block' : 'none';
        document.getElementById('submit-btn').textContent = mode === 'signin' ? 'Sign in' : 'Sign up';
        document.getElementById('status').className = 'status';
      });
    });

    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submit-btn');
      const status = document.getElementById('status');
      btn.disabled = true;
      status.className = 'status';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const name = document.getElementById('name').value;

      try {
        const endpoint = mode === 'signin'
          ? '/auth/sign-in/email'
          : '/auth/sign-up/email';

        const body = mode === 'signin'
          ? { email, password }
          : { email, password, name: name || email.split('@')[0] };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          showProfile(data.user);
        } else {
          status.textContent = data.message || 'Authentication failed';
          status.className = 'status error';
        }
      } catch (err) {
        status.textContent = 'Request failed';
        status.className = 'status error';
      }
      btn.disabled = false;
    });

    function showProfile(user) {
      document.getElementById('auth-view').style.display = 'none';
      document.getElementById('profile-view').style.display = 'block';
      document.getElementById('user-info').textContent = user?.email || 'Authenticated';
    }

    async function signOut() {
      document.getElementById('auth-view').style.display = 'block';
      document.getElementById('profile-view').style.display = 'none';
    }
  </script>
</body>
</html>`;

// Serve the login page at the root URL.
export const page = api.raw(
  { expose: true, method: "GET", path: "/" },
  async (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  }
);
