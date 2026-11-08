/* ==========================================================
   nitinmaurya.in — interactions
   ========================================================== */
(() => {
  "use strict";

  /* ---------- CONFIG ----------
     CONTACT_ENDPOINT: leave empty to fall back to the visitor's mail client (mailto:).
     To receive messages straight in your inbox, create a free form at https://formspree.io
     (or Web3Forms / your own API) and paste its POST URL here, e.g.
     "https://formspree.io/f/xxxxxxxx". The script POSTs JSON {name, org, email, message}. */
  const CONFIG = {
    CONTACT_ENDPOINT: "",
    EMAIL: "nitin_maurya@outlook.com",
    LINKEDIN: "https://www.linkedin.com/in/maurya-nittin/",
    PHONE: "+91 90133 06829",
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Boot sequence ---------- */
  const boot = $("#boot");
  const bootLines = [
    '<span class="dm">[    0.000000]</span> Initializing secure kernel <span class="cy">nm-os 10.0-architect</span>',
    '<span class="dm">[    0.142118]</span> Loading module: <span class="cy">siem.netwitness</span> ............ <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.233902]</span> Loading module: <span class="cy">soar.cortex_xsoar</span> ......... <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.301774]</span> Loading module: <span class="cy">edr.crowdstrike_falcon</span> .... <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.388410]</span> Loading module: <span class="cy">ztna.zscaler_zpa</span> .......... <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.452005]</span> Mapping MITRE ATT&amp;CK matrix ................ <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.517632]</span> Engaging ZeroOps automation (90% auto) ...... <span class="ok">[ OK ]</span>',
    '<span class="dm">[    0.600000]</span> Establishing TLS 1.3 channel ................ <span class="ok">[ OK ]</span>',
    "",
    '<span class="cy">Welcome, visitor.</span> Access granted.',
  ];
  let bootDone = false;
  const endBoot = () => {
    if (bootDone) return;
    bootDone = true;
    boot.classList.add("done");
    try { sessionStorage.setItem("booted", "1"); } catch (_) {}
    startHeroTyping();
  };
  let seen = false;
  try { seen = sessionStorage.getItem("booted") === "1"; } catch (_) {}
  if (seen || reduced) {
    boot.style.display = "none";
    bootDone = true;
    startHeroTyping();
  } else {
    const log = $("#boot-log");
    let i = 0;
    const next = () => {
      if (bootDone) return;
      if (i < bootLines.length) {
        log.innerHTML += bootLines[i++] + "\n";
        setTimeout(next, 110 + Math.random() * 90);
      } else setTimeout(endBoot, 500);
    };
    next();
    $("#boot-skip").addEventListener("click", endBoot);
    window.addEventListener("keydown", endBoot, { once: true });
    boot.addEventListener("click", endBoot);
  }

  /* ---------- Hero typing ---------- */
  function startHeroTyping() {
    const el = $("#typed");
    if (!el || reduced) return;
    const phrases = ["Intelligent Automation", "ZeroOps Response", "Zero Trust Architecture", "Modular SOAR Playbooks"];
    let p = 0, c = phrases[0].length, del = true;
    const tick = () => {
      const word = phrases[p];
      if (del) {
        c--;
        if (c <= 0) { del = false; p = (p + 1) % phrases.length; }
      } else {
        c++;
        if (c >= phrases[p].length) { del = true; el.textContent = phrases[p]; return setTimeout(tick, 2400); }
      }
      el.textContent = phrases[p].slice(0, Math.max(c, 0)) || "​";
      setTimeout(tick, del ? 38 : 75);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Nav ---------- */
  const toggle = $("#nav-toggle"), links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", links).forEach((a) => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  const navPath = $("#nav-path");
  const sectionMap = { hero: "~" };
  $$("a[data-path]", links).forEach((a) => (sectionMap[a.getAttribute("href").slice(1)] = a.dataset.path));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navPath.textContent = sectionMap[id] || "~";
      $$("a", links).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section[id]").forEach((s) => spy.observe(s));

  /* ---------- Reveal + counters ---------- */
  const countUp = (el) => {
    const target = +el.dataset.count;
    if (reduced) return (el.textContent = target);
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  $$(".section, .stats, .telemetry").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in-view");
      $$("[data-count]", e.target).forEach((c) => { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal, .matrix").forEach((el) => io.observe(el));

  /* ---------- MITRE mini matrix ---------- */
  const tactics = [
    ["Initial Access", "Phishing, valid accts", 0.95],
    ["Execution", "Scripting, LOLBins", 0.8],
    ["Persistence", "Run keys, services", 0.65],
    ["Priv. Escalation", "Token abuse", 0.55],
    ["Defense Evasion", "Obfuscation", 0.6],
    ["Credential Access", "Brute force, dumping", 0.75],
    ["Discovery", "Recon, scanning", 0.7],
    ["Lateral Movement", "RDP / SMB", 0.6],
    ["Collection", "Data staging", 0.45],
    ["Command & Control", "Beaconing, proxies", 0.85],
    ["Exfiltration", "Over web / C2", 0.7],
    ["Impact", "DDoS, ransomware", 0.8],
    ["Reconnaissance", "Probing, scanning", 0.75],
    ["Resource Dev.", "Shadow AI / LLM", 0.65],
  ];
  const mg = $("#matrix-grid");
  mg.innerHTML = tactics.map(([t, d, a], i) =>
    `<div class="m-cell" style="--a:${a};transition-delay:${i * 40}ms"><b>${esc(t)}</b><small>${esc(d)}</small></div>`
  ).join("");

  /* ---------- Telemetry: sparkline + live feed (simulated) ---------- */
  const pts = Array.from({ length: 40 }, () => 25 + Math.random() * 20);
  const line = $("#spark-line"), fill = $("#spark-fill");
  const drawSpark = () => {
    const w = 300, h = 60, step = w / (pts.length - 1);
    const coords = pts.map((v, i) => `${(i * step).toFixed(1)},${(h - v).toFixed(1)}`);
    line.setAttribute("points", coords.join(" "));
    fill.setAttribute("points", `0,${h} ${coords.join(" ")} ${w},${h}`);
  };
  drawSpark();

  const feed = $("#tele-feed");
  const events = [
    ["c-green", "AUTO-CLOSED", "phishing url verdict=benign · VT 0/94"],
    ["c-cyan", "ENRICHED", "IOC 185.x.x.x → Anomali · Unit 42 · AI summary"],
    ["c-amber", "CONTAINED", "host WS-0x41 isolated via Falcon RTR"],
    ["c-green", "AUTO-CLOSED", "impossible-travel · MFA verified"],
    ["c-cyan", "PLAYBOOK", "enrich() → contain() → notify() ok"],
    ["c-amber", "APPROVAL", "customer authorized remediation #INC-2291"],
    ["c-green", "DETECTED", "T1566.002 spearphishing link · rule fired"],
    ["c-cyan", "ZPA", "segment policy updated · app-conn healthy"],
    ["c-amber", "SHADOW-AI", "unsanctioned LLM endpoint blocked"],
    ["c-green", "CALDERA", "op validated · 0 detection gaps"],
  ];
  const pushFeed = () => {
    const [cls, tag, msg] = events[Math.floor(Math.random() * events.length)];
    const t = new Date().toTimeString().slice(0, 8);
    const d = document.createElement("div");
    d.innerHTML = `<span class="t">${t}</span> <span class="${cls}">[${tag}]</span> ${esc(msg)}`;
    feed.appendChild(d);
    while (feed.children.length > 7) feed.firstChild.remove();
  };
  for (let i = 0; i < 6; i++) pushFeed();
  if (!reduced) {
    setInterval(() => {
      if (document.hidden) return;
      pts.shift();
      const last = pts[pts.length - 1];
      pts.push(Math.max(8, Math.min(55, last + (Math.random() - 0.5) * 14)));
      drawSpark();
    }, 700);
    setInterval(() => { if (!document.hidden) pushFeed(); }, 1800);
  }

  /* ---------- Background network canvas ---------- */
  const cv = $("#bg-net"), ctx = cv.getContext("2d");
  let W, H, nodes = [];
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    const n = Math.min(70, Math.floor((innerWidth * innerHeight) / 22000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
    }));
  };
  resize();
  addEventListener("resize", resize);
  const maxD = 150 * Math.min(window.devicePixelRatio || 1, 2);
  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(0,240,255,${(1 - d / maxD) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(0,240,255,.55)";
      ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
    }
    if (!reduced) requestAnimationFrame(frame);
  };
  frame();

  /* ---------- Project cards (tap to expand on touch) ---------- */
  $$(".proj").forEach((p) => {
    p.addEventListener("click", () => p.classList.toggle("open"));
    p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); p.classList.toggle("open"); } });
  });

  /* ---------- Toast + copy ---------- */
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("✓ credential ID copied to clipboard"); }
    catch (_) { toast(b.dataset.copy); }
  }));

  /* ---------- Interactive terminal ---------- */
  const out = $("#term-out"), input = $("#term-input"), form = $("#term-form"), ps = $("#term-ps"), body = $("#term-body");
  const PS = "visitor@nitinmaurya.in:~$";
  const history = []; let hIdx = -1;
  let wizard = null; // {step, data}

  const print = (html = "", cls = "") => {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    d.innerHTML = html;
    out.appendChild(d);
    body.scrollTop = body.scrollHeight;
  };
  const echo = (prompt, txt) => print(`<span class="c-green">${esc(prompt)}</span> ${esc(txt)}`);

  const commands = {
    help: () => print(
`<span class="c-cyan">Available commands</span>
  <span class="c-amber">send-message</span>   open a secure channel &amp; send me a message
  <span class="c-amber">whoami</span>         who am I
  <span class="c-amber">skills</span>         core technology stack
  <span class="c-amber">experience</span>     career log
  <span class="c-amber">certs</span>          certifications &amp; IDs
  <span class="c-amber">contact</span>        direct contact channels
  <span class="c-amber">resume</span>         download my CV (PDF)
  <span class="c-amber">linkedin</span>       open LinkedIn profile
  <span class="c-amber">clear</span>          clear the screen`),
    whoami: () => print(
`<span class="c-cyan">Nitin Maurya</span> — Cyber Security Architect &amp; Automation Consultant
10+ yrs · banking &amp; telecom · New Delhi, India
Currently: British Telecom (Managed Security Services)
Previously: Senior Manager IT (Cyber Security), Punjab National Bank`),
    skills: () => print(
`<span class="c-amber">SOAR</span>     Cortex XSOAR · Tines · Splunk SOAR
<span class="c-amber">SIEM</span>     RSA NetWitness · Microsoft Sentinel · Elastic
<span class="c-amber">EDR</span>      CrowdStrike Falcon · Defender ATP
<span class="c-amber">NET</span>      Zscaler ZIA/ZPA · Prisma SASE · Palo Alto · Check Point · FortiGate
<span class="c-amber">CLOUD</span>    Azure · AWS
<span class="c-amber">CODE</span>     Python · N8N · REST APIs
<span class="c-amber">OFFSEC</span>   Caldera · Metasploit · Wireshark · Security Onion · Wazuh`),
    experience: () => print(
`<span class="c-green">2023 → now </span>  Cyber Security Architect &amp; Automation Consultant · British Telecom
<span class="c-green">2016 → 2023</span>  Senior Manager IT (Cyber Security) · Punjab National Bank
<span class="c-green">2015 → 2016</span>  Single Window Operator · Canara Bank`),
    certs: () => print(
`PCSAE   Palo Alto Certified Security Automation Engineer
Tines   Tines Advanced Certification
CEH     EC-Council Certified Ethical Hacker
Sec+    CompTIA Security+`),
    contact: () => print(
`email     <a class="c-cyan" href="mailto:${CONFIG.EMAIL}">${CONFIG.EMAIL}</a>
linkedin  <a class="c-cyan" href="${CONFIG.LINKEDIN}" target="_blank" rel="noopener">in/maurya-nittin</a>
phone     ${CONFIG.PHONE}`),
    resume: () => { print("Fetching Nitin_Maurya_Resume.pdf ... <span class=\"c-green\">200 OK</span>"); const a = document.createElement("a"); a.href = "Nitin_Maurya_Resume.pdf"; a.download = ""; a.click(); },
    linkedin: () => { print("Opening LinkedIn ..."); window.open(CONFIG.LINKEDIN, "_blank", "noopener"); },
    clear: () => (out.innerHTML = ""),
    "sudo hire-me": () => print(
`[sudo] password for visitor: ********
<span class="c-green">✓ Authentication successful.</span> Excellent decision.
Run <span class="c-amber">send-message</span> to initiate the engagement.`),
    sudo: () => print('<span class="c-red">visitor is not in the sudoers file.</span> Try <span class="c-amber">sudo hire-me</span> 😉'),
    ls: () => print('skills/  experience/  projects/  certs/  <span class="c-green">Nitin_Maurya_Resume.pdf</span>'),
    pwd: () => print("/home/visitor"),
    date: () => print(new Date().toString()),
    exit: () => print("Connection to nitinmaurya.in kept open. There's no escape from good security. 🙂"),
    "rm -rf /": () => print('<span class="c-red">Permission denied.</span> Nice try — this incident has been auto-triaged. 🛡️'),
  };
  commands["nitin-maurya --send-message"] = () => startWizard();
  commands["send-message"] = () => startWizard();

  const steps = [
    { key: "name", prompt: "> Enter your name:", validate: (v) => v.length >= 2 || "Name looks too short." },
    { key: "org", prompt: "> Enter your organization (optional):", validate: () => true },
    { key: "email", prompt: "> Enter your email:", validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "That doesn't look like a valid email." },
    { key: "message", prompt: "> Enter message payload:", validate: (v) => v.length >= 5 || "Payload too small — tell me a bit more." },
  ];
  function startWizard() {
    wizard = { step: 0, data: {} };
    print('<span class="c-cyan">$ nitin-maurya --send-message</span>');
    print('<span class="c-dim">Secure channel opened. Type </span><span class="c-amber">cancel</span><span class="c-dim"> at any time to abort.</span>');
    ps.textContent = steps[0].prompt;
  }
  async function wizardInput(v) {
    const s = steps[wizard.step];
    echo(s.prompt, v);
    if (v.toLowerCase() === "cancel") { wizard = null; ps.textContent = PS; return print('<span class="c-amber">Transmission aborted.</span>'); }
    const ok = s.validate(v);
    if (ok !== true) return print(`<span class="c-red">✗ ${esc(ok)}</span>`);
    wizard.data[s.key] = v;
    wizard.step++;
    if (wizard.step < steps.length) { ps.textContent = steps[wizard.step].prompt; return; }
    ps.textContent = PS;
    await transmit(wizard.data);
    wizard = null;
  }
  async function transmit(d) {
    print("Encrypting payload ........ <span class=\"c-green\">[ OK ]</span>");
    print("Routing secure packet ..... <span class=\"c-cyan\">[ .. ]</span>");
    input.disabled = true;
    try {
      if (CONFIG.CONTACT_ENDPOINT) {
        const r = await fetch(CONFIG.CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: d.name, org: d.org, email: d.email, message: d.message, _subject: `Portfolio contact from ${d.name}` }),
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
        print('<span class="c-green">✓ Transmission complete. Message routed to inbox.</span> I\'ll get back to you soon.');
      } else {
        const subject = encodeURIComponent(`Portfolio contact from ${d.name}${d.org ? " (" + d.org + ")" : ""}`);
        const bodyTxt = encodeURIComponent(`${d.message}\n\n— ${d.name}${d.org ? "\n" + d.org : ""}\n${d.email}`);
        location.href = `mailto:${CONFIG.EMAIL}?subject=${subject}&body=${bodyTxt}`;
        print('<span class="c-green">✓ Packet handed to your mail client.</span> Hit send there to complete transmission.');
      }
    } catch (e) {
      print(`<span class="c-red">✗ Transmission failed (${esc(e.message)}).</span> Email me directly: <a class="c-cyan" href="mailto:${CONFIG.EMAIL}">${CONFIG.EMAIL}</a>`);
    } finally {
      input.disabled = false; input.focus({ preventScroll: true });
    }
  }

  const run = (raw) => {
    const v = raw.trim();
    if (wizard) return wizardInput(v);
    echo(PS, raw);
    if (!v) return;
    history.unshift(v); hIdx = -1;
    const cmd = commands[v.toLowerCase()];
    if (cmd) cmd();
    else print(`<span class="c-red">command not found:</span> ${esc(v)} — type <span class="c-amber">help</span>`);
  };

  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; run(v); });
  input.addEventListener("keydown", (e) => {
    if (wizard) return;
    if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIdx = Math.min(hIdx + 1, history.length - 1); input.value = history[hIdx]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hIdx = Math.max(hIdx - 1, -1); input.value = hIdx < 0 ? "" : history[hIdx]; }
    else if (e.key === "Tab") {
      e.preventDefault();
      const m = Object.keys(commands).filter((k) => k.startsWith(input.value.toLowerCase()) && !k.includes(" "));
      if (m.length === 1) input.value = m[0];
      else if (m.length > 1) print(m.join("   "), "c-dim");
    }
  });
  body.addEventListener("click", () => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });
  $$(".term-hints button").forEach((b) => b.addEventListener("click", () => {
    if (wizard) { wizard = null; ps.textContent = PS; }
    run(b.dataset.cmd); input.focus({ preventScroll: true });
  }));

  print('<span class="c-dim">Last login: ' + new Date().toUTCString() + ' from secure-gateway</span>');
  print('Welcome to <span class="c-cyan">nitinmaurya.in</span>. Type <span class="c-amber">help</span> for commands, or <span class="c-amber">send-message</span> to reach me.');
})();
