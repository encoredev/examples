import { api } from "encore.dev/api";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bird + Encore</title>
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
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; }
    .card-head h2 { margin-bottom: 0; }
    .info { border: 1px solid #ccc; padding: 16px; font-size: 12px; line-height: 1.7; background: #fff; }
    .info h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; margin-bottom: 6px; margin-top: 14px; }
    .info h3:first-child { margin-top: 0; }
    .info p { color: #555; margin-bottom: 8px; }
    .info code { background: #EEEEE1; padding: 1px 4px; font-size: 11px; }
    .info ol, .info ul { padding-left: 16px; color: #555; margin-bottom: 8px; }
    .info li { margin-bottom: 2px; }
    .info a { color: #4651FF; text-decoration: none; }
    .info a:hover { text-decoration: underline; }
    .hint { background: #fff; border: 1px solid #ccc; padding: 10px 12px; margin-bottom: 12px; font-size: 12px; color: #555; line-height: 1.5; }
    .hint code { background: #EEEEE1; padding: 1px 4px; font-size: 11px; }
    .row2 { display: flex; gap: 12px; }
    .row2 > div { flex: 1; min-width: 0; }
    label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
    input { width: 100%; padding: 7px 10px; border: 1px solid #ccc; font-size: 13px; margin-bottom: 10px; background: #fff; font-family: inherit; }
    button { background: #111; color: #EEEEE1; border: none; padding: 8px 16px; font-size: 13px; cursor: pointer; font-weight: 500; font-family: inherit; }
    button:hover { background: #333; }
    button:disabled { background: #999; cursor: not-allowed; }
    button.full { width: 100%; }
    button.ghost { background: #fff; color: #111; border: 1px solid #ccc; padding: 4px 10px; font-size: 12px; }
    button.ghost:hover { background: #EEEEE1; }
    .status { margin-top: 10px; padding: 10px; font-size: 12px; display: none; }
    .status.success { display: block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status.error { display: block; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .empty { font-size: 13px; color: #666; padding: 8px 0; }
    .appt { border-top: 1px solid #e5e5e5; padding: 12px 0; }
    .appt:first-child { border-top: none; padding-top: 0; }
    .appt-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
    .appt-name { font-weight: 600; font-size: 14px; }
    .appt-meta { font-size: 12px; color: #666; }
    .appt-meta code { font-size: 11px; }
    .actions { display: flex; gap: 6px; flex-shrink: 0; }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .badge { font-size: 11px; padding: 1px 6px; border: 1px solid #ccc; text-transform: uppercase; letter-spacing: 0.04em; }
    .b-scheduled, .b-pending { background: #fefce8; color: #854d0e; border-color: #fde68a; }
    .b-queued { background: #eef2ff; color: #3730a3; border-color: #c7d2fe; }
    .b-accepted { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
    .b-cancelled, .b-skipped { background: #f5f5f5; color: #666; border-color: #ddd; }
    .err { margin-top: 6px; font-size: 12px; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; padding: 6px 8px; word-break: break-word; }
    .setup { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; padding: 14px 16px; margin-bottom: 16px; font-size: 13px; line-height: 1.6; }
    .setup strong { display: block; font-size: 13px; margin-bottom: 4px; }
    .setup p { margin-bottom: 8px; }
    .setup ol { padding-left: 18px; margin-bottom: 8px; }
    .setup li { margin-bottom: 4px; }
    .setup pre { background: #fff; border: 1px solid #fde68a; padding: 6px 8px; font-size: 12px; overflow-x: auto; margin-top: 4px; }
    .setup code { background: #fff; padding: 1px 4px; font-size: 12px; }
    .setup a { color: #4651FF; text-decoration: none; }
    .setup a:hover { text-decoration: underline; }
    .status.notice { display: block; background: #fffbeb; color: #78350f; border: 1px solid #fde68a; }
    .resched { margin-top: 10px; padding: 10px; background: #fafaf5; border: 1px solid #e5e5e5; }
    .resched .actions { justify-content: flex-end; }
    @media (max-width: 768px) { .layout { flex-direction: column; } .sidebar { width: 100%; position: static; } }
    @media (max-width: 480px) { .row2 { flex-direction: column; gap: 0; } .appt-top { flex-direction: column; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Bird + Encore</h1>
    <p class="subtitle">Appointment reminders over SMS</p>
    <div class="layout">
      <div class="main">
        <div id="setup" class="setup" hidden>
          <strong>Bird isn't connected yet</strong>
          <p>Everything else works without it: create, cancel, reschedule, and dispatch appointments. Reminders stay <em>pending</em> until you add credentials, then the next dispatch sends them.</p>
          <ol>
            <li>Create an <a href="https://bird.com/docs/guides/authentication" target="_blank">API key</a> and set up an <a href="https://bird.com/docs/guides/sms/sending-sms" target="_blank">SMS sender</a> in Bird.</li>
            <li>From the app directory, store them as secrets:
              <pre id="setupCmds"></pre>
            </li>
            <li>Restart <code>encore run</code> and click <em>Dispatch due reminders</em>.</li>
          </ol>
        </div>
        <div class="card">
          <h2>Create Appointment</h2>
          <div class="hint">
            The defaults make the reminder due right away, so you can dispatch it immediately.
            <code>+15005550006</code> is Bird's simulated recipient.
          </div>
          <form id="create">
            <div class="row2">
              <div>
                <label for="customerName">Customer name</label>
                <input type="text" id="customerName" value="Ada" required>
              </div>
              <div>
                <label for="phone">Phone (E.164)</label>
                <input type="tel" id="phone" value="+15005550006" required>
              </div>
            </div>
            <div class="row2">
              <div>
                <label for="startsAt">Appointment starts</label>
                <input type="datetime-local" id="startsAt" required>
              </div>
              <div>
                <label for="remindAt">Send reminder at</label>
                <input type="datetime-local" id="remindAt" required>
              </div>
            </div>
            <button type="submit" class="full">Create appointment</button>
          </form>
          <div id="createStatus" class="status"></div>
        </div>

        <div class="card">
          <div class="card-head">
            <h2>Appointments</h2>
            <button id="dispatch">Dispatch due reminders</button>
          </div>
          <div id="dispatchStatus" class="status"></div>
          <div id="list"><div class="empty">Loading...</div></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="info">
          <h3>What is Bird?</h3>
          <p><a href="https://bird.com">Bird</a> is a messaging platform for SMS, WhatsApp, and email. This example uses its TypeScript SDK to send SMS reminders.</p>
          <h3>How it works</h3>
          <ol>
            <li>A cron job calls <code>/reminders/dispatch</code> every 5 minutes</li>
            <li>Due reminders are published to Pub/Sub</li>
            <li>A subscriber rechecks the appointment and sends the SMS</li>
            <li>Bird reports delivery via a signed webhook</li>
          </ol>
          <p>Cron jobs don't run locally, so use the dispatch button instead.</p>
          <h3>Encore integration</h3>
          <ul>
            <li>PostgreSQL for appointment state</li>
            <li>Cron + Pub/Sub for reliable sends</li>
            <li>Raw endpoint for webhook verification</li>
            <li>Secrets for Bird credentials</li>
          </ul>
          <h3>Sending real SMS</h3>
          <p>Set <code>BirdAPIKey</code> and <code>BirdSMSSender</code> with <code>encore secret set --type local</code>. Until then, reminders wait as pending.</p>
          <h3>Local dashboard</h3>
          <p>Open <a href="http://localhost:9400">localhost:9400</a> to explore your API docs, traces, and database. Follow a reminder from dispatch through Pub/Sub to the Bird request in the trace view.</p>
          <h3>Learn more</h3>
          <ul>
            <li><a href="https://encore.dev/docs/ts" target="_blank">Encore.ts docs</a></li>
            <li><a href="https://encore.dev/docs/ts/primitives/pubsub" target="_blank">Pub/Sub</a> and <a href="https://encore.dev/docs/ts/primitives/cron-jobs" target="_blank">cron jobs</a></li>
            <li><a href="https://encore.dev/docs/ts/primitives/databases" target="_blank">Databases</a> and <a href="https://encore.dev/docs/ts/primitives/secrets" target="_blank">secrets</a></li>
            <li><a href="https://encore.dev/docs/ts/develop/local-development" target="_blank">Local development</a></li>
            <li><a href="https://bird.com/docs/guides/sms/overview" target="_blank">Bird SMS guide</a></li>
            <li><a href="https://bird.com/docs/sdks/typescript" target="_blank">Bird TypeScript SDK</a></li>
            <li><a href="https://bird.com/docs/guides/webhooks" target="_blank">Bird webhooks</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <script>
    function toLocalInput(d) {
      const pad = (n) => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    function fmt(d) {
      return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    }
    function el(tag, props, children) {
      const node = document.createElement(tag);
      Object.assign(node, props || {});
      (children || []).forEach((c) => node.append(c));
      return node;
    }
    function showStatus(node, ok, text) {
      node.textContent = text;
      node.className = 'status ' + (ok ? 'success' : 'error');
    }
    async function call(method, path, body) {
      const res = await fetch(path, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    }

    const now = new Date();
    document.getElementById('startsAt').value = toLocalInput(new Date(now.getTime() + 60 * 60 * 1000));
    document.getElementById('remindAt').value = toLocalInput(new Date(now.getTime() - 60 * 1000));

    let editing = null;
    let birdConfigured = true;

    async function loadBirdStatus() {
      try {
        const data = await call('GET', '/reminders/bird-status');
        birdConfigured = data.configured;
        document.getElementById('setupCmds').textContent = data.missingSecrets
          .map((name) => 'encore secret set --type local ' + name)
          .join('\\n');
        document.getElementById('setup').hidden = data.configured;
      } catch (err) {
        // Leave the banner hidden if the status check itself fails.
      }
    }

    function renderAppointment(a) {
      const meta = el('div', { className: 'appt-meta' }, [
        a.phone + ' · starts ' + fmt(a.startsAt) + ' · remind ' + fmt(a.reminder.dueAt),
      ]);
      const badges = el('div', { className: 'badges' }, [
        el('span', { className: 'badge b-' + a.status, textContent: a.status }),
        el('span', { className: 'badge b-' + a.reminder.status, textContent: 'reminder ' + a.reminder.status }),
        el('span', { className: 'badge', textContent: a.reminder.attempts + ' attempt' + (a.reminder.attempts === 1 ? '' : 's') }),
      ]);
      if (a.reminder.birdMessageID) {
        badges.append(el('span', { className: 'badge', textContent: a.reminder.birdMessageID }));
      }

      const actions = el('div', { className: 'actions' });
      if (a.status === 'scheduled') {
        actions.append(
          el('button', { className: 'ghost', textContent: 'Reschedule', onclick: () => { editing = a.id; load(); } }),
          el('button', { className: 'ghost', textContent: 'Cancel', onclick: () => act('POST', '/appointments/' + a.id + '/cancel') }),
        );
      }

      const row = el('div', { className: 'appt' }, [
        el('div', { className: 'appt-top' }, [
          el('div', {}, [el('div', { className: 'appt-name', textContent: a.customerName }), meta]),
          actions,
        ]),
        badges,
      ]);
      if (a.reminder.lastError) {
        row.append(el('div', { className: 'err', textContent: 'Last send error: ' + a.reminder.lastError }));
      }
      if (editing === a.id) row.append(renderReschedule(a));
      return row;
    }

    function renderReschedule(a) {
      const starts = el('input', { type: 'datetime-local', value: toLocalInput(new Date(a.startsAt)) });
      const remind = el('input', { type: 'datetime-local', value: toLocalInput(new Date(a.reminder.dueAt)) });
      return el('div', { className: 'resched' }, [
        el('div', { className: 'row2' }, [
          el('div', {}, [el('label', { textContent: 'Appointment starts' }), starts]),
          el('div', {}, [el('label', { textContent: 'Send reminder at' }), remind]),
        ]),
        el('div', { className: 'actions' }, [
          el('button', { className: 'ghost', textContent: 'Close', onclick: () => { editing = null; load(); } }),
          el('button', {
            className: 'ghost',
            textContent: 'Save',
            onclick: async () => {
              editing = null;
              await act('POST', '/appointments/' + a.id + '/reschedule', {
                startsAt: new Date(starts.value).toISOString(),
                remindAt: new Date(remind.value).toISOString(),
              });
            },
          }),
        ]),
      ]);
    }

    async function act(method, path, body) {
      try {
        await call(method, path, body);
      } catch (err) {
        showStatus(document.getElementById('dispatchStatus'), false, err.message);
      }
      load();
    }

    async function load() {
      const list = document.getElementById('list');
      try {
        const data = await call('GET', '/appointments');
        list.replaceChildren();
        if (data.appointments.length === 0) {
          list.append(el('div', { className: 'empty', textContent: 'No appointments yet. Create one above.' }));
        }
        data.appointments.forEach((a) => list.append(renderAppointment(a)));
      } catch (err) {
        list.replaceChildren(el('div', { className: 'empty', textContent: 'Failed to load appointments: ' + err.message }));
      }
    }

    document.getElementById('create').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const status = document.getElementById('createStatus');
      btn.disabled = true;
      status.className = 'status';
      try {
        await call('POST', '/appointments', {
          customerName: document.getElementById('customerName').value,
          phone: document.getElementById('phone').value,
          startsAt: new Date(document.getElementById('startsAt').value).toISOString(),
          remindAt: new Date(document.getElementById('remindAt').value).toISOString(),
        });
        showStatus(status, true, 'Appointment created.');
        load();
      } catch (err) {
        showStatus(status, false, err.message);
      }
      btn.disabled = false;
    });

    document.getElementById('dispatch').addEventListener('click', async (e) => {
      const btn = e.target;
      const status = document.getElementById('dispatchStatus');
      btn.disabled = true;
      try {
        const data = await call('POST', '/reminders/dispatch');
        const n = data.queued + ' reminder' + (data.queued === 1 ? '' : 's');
        if (data.queued === 0) {
          showStatus(status, true, 'No reminders are due right now.');
        } else if (!birdConfigured) {
          status.textContent = 'Found ' + n + " due. Bird isn't connected, so " + (data.queued === 1 ? 'it stays' : 'they stay') + ' pending until you add credentials (see above).';
          status.className = 'status notice';
        } else {
          showStatus(status, true, 'Queued ' + n + ' for sending.');
        }
      } catch (err) {
        showStatus(status, false, err.message);
      }
      btn.disabled = false;
      load();
    });

    loadBirdStatus();
    load();
    setInterval(() => { if (!editing) load(); }, 2000);
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
