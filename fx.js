const isTouch = matchMedia("(pointer: coarse)").matches;
(() => {
  const WHATSAPP_NUMBER = "5547999416062";
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const themes = [
    { sel: ".produtos-gemas",     name: "Gemas",     emoji: "💎", color: "rgba(181,140,255,0.95)", glow: "rgba(181,140,255,0.35)", sound: "sound/click_gemas.mp3" },
    { sel: ".produtos-comida",    name: "Comida",    emoji: "🍎", color: "rgba(255,90,90,0.95)",   glow: "rgba(255,90,90,0.35)",   sound: "sound/click_comida.mp3" },
    { sel: ".produtos-essencias", name: "Essências", emoji: "🧪", color: "rgba(26,255,156,0.95)",  glow: "rgba(26,255,156,0.35)",  sound: "sound/click_essencias.mp3" },
    { sel: ".produtos-curingas",  name: "Curingas",  emoji: "🃏", color: "rgba(255,205,90,0.95)",  glow: "rgba(255,205,90,0.30)",  sound: "sound/click_curingas.mp3" },
  ];

  function getTheme(el) {
    for (const t of themes) {
      const sec = el.closest?.(t.sel);
      if (sec) return { ...t, section: sec };
    }
    return { name: "Loja", emoji: "✨", color: "rgba(0,255,204,0.95)", glow: "rgba(0,255,204,0.25)", sound: "sound/click.mp3", section: null };
  }

  function makeOrderId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "LAL-";
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function getProductInfo(btn) {
    const card = btn.closest?.(".card");
    const title = (btn.dataset?.produto || card?.querySelector("h3")?.textContent || "").replace(/\s+/g, " ").trim();
    const price = (card?.querySelector("p")?.textContent || "").replace(/\s+/g, " ").trim();
    return { title, price };
  }

  function buildWhatsAppLink({ title, price, orderId }) {
    const msg =
      `Olá! Quero comprar na LALAUDC STORE.\n\n` +
      `• Produto: ${title || "—"}\n` +
      `• Valor: ${price || "—"}\n` +
      `• Pedido: #${orderId}\n\n` +
      `Meu ID do Dragon City: ________\n` +
      `Forma de pagamento: PIX\n\n` +
      `✅ Atendimento ONLINE\n` +
      `🔒 Não pedimos senha`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  const style = document.createElement("style");
  style.textContent = `
    #fx-layer{position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden}

    .fx-progress{position:fixed;left:0;top:0;height:3px;width:100%;z-index:10001;background:rgba(255,255,255,0.06)}
    .fx-progress>div{height:100%;width:0%;background:rgba(0,255,204,0.85);box-shadow:0 0 18px rgba(0,255,204,0.35);transition:background .2s ease, box-shadow .2s ease}

    .fx-hud{position:fixed;left:14px;top:12px;z-index:10000;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;
      background:rgba(10,8,26,0.55);backdrop-filter:blur(10px);box-shadow:0 12px 30px rgba(0,0,0,0.45);
      color:rgba(255,255,255,0.9);font:800 12px/1 Arial,sans-serif;letter-spacing:.5px;user-select:none}
    .fx-hud .dot{width:10px;height:10px;border-radius:999px;background:rgba(26,255,156,0.95);box-shadow:0 0 18px rgba(26,255,156,0.45)}

    .fx-nav{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:9999;display:flex;flex-direction:column;gap:10px;padding:10px;border-radius:18px;
      background:rgba(10,8,26,0.55);backdrop-filter:blur(10px);box-shadow:0 12px 30px rgba(0,0,0,0.45)}
    .fx-nav button{all:unset;cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;color:rgba(255,255,255,0.88);
      font:600 12px/1 Arial,sans-serif;letter-spacing:.4px;background:rgba(255,255,255,0.06);transition:transform .15s ease, background .15s ease, box-shadow .15s ease;white-space:nowrap}
    .fx-nav button:hover{transform:translateX(-2px);background:rgba(255,255,255,0.10);box-shadow:0 0 0 1px rgba(255,255,255,0.12)}
    .fx-nav button.active{background:rgba(255,255,255,0.14);box-shadow:0 0 0 1px rgba(255,255,255,0.18),0 0 22px rgba(0,255,204,0.18)}
    .fx-dot{width:10px;height:10px;border-radius:999px;flex:0 0 auto}

    .fx-tilt{transform-style:preserve-3d;will-change:transform}
    .fx-shine{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .2s ease;mix-blend-mode:screen}

    .fx-float{position:absolute;transform:translate(-50%,-50%);font:900 14px/1 Arial,sans-serif;letter-spacing:.6px;text-shadow:0 8px 18px rgba(0,0,0,0.55);
      opacity:0;will-change:transform,opacity;user-select:none;white-space:nowrap}

    .fx-trust{max-width:1100px;margin:18px auto 0;padding:0 20px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .fx-trust .t{padding:14px 14px;border-radius:16px;background:rgba(255,255,255,0.06);box-shadow:0 0 0 1px rgba(255,255,255,0.08);
      color:rgba(255,255,255,0.90);font:800 12px/1 Arial,sans-serif;letter-spacing:.4px;display:flex;gap:10px;align-items:center;justify-content:center}
    .fx-trust .t span{opacity:.95}

    .fx-cta{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:10002;display:none;gap:10px;align-items:center;padding:12px 14px;border-radius:18px;
      background:rgba(10,8,26,0.70);backdrop-filter:blur(10px);box-shadow:0 14px 35px rgba(0,0,0,0.55);color:rgba(255,255,255,0.92);
      font:800 13px/1 Arial,sans-serif;letter-spacing:.4px;cursor:pointer;user-select:none}
    .fx-cta .pill{padding:10px 14px;border-radius:999px;background:rgba(0,255,204,0.95);color:#001b12;box-shadow:0 0 22px rgba(0,255,204,0.35);font:900 13px/1 Arial,sans-serif}

    @media (max-width: 600px){
      .fx-nav{display:none}
      .fx-hud{top:10px;left:10px;padding:9px 10px;border-radius:14px;font-size:11px}
      .fx-trust{grid-template-columns:1fr;gap:10px}
      .fx-cta{display:flex}
    }
  `;
  document.head.appendChild(style);

  const fxLayer = document.createElement("div");
  fxLayer.id = "fx-layer";
  document.body.appendChild(fxLayer);

  const progress = document.createElement("div");
  progress.className = "fx-progress";
  const progressFill = document.createElement("div");
  progress.appendChild(progressFill);
  document.body.appendChild(progress);

  const hud = document.createElement("div");
  hud.className = "fx-hud";
  hud.innerHTML = `<span class="dot"></span><span>ATENDIMENTO ONLINE</span>`;
  document.body.appendChild(hud);

  const cta = document.createElement("div");
  cta.className = "fx-cta";
  cta.innerHTML = `<span>📲</span><span>Comprar no WhatsApp</span><span class="pill">ABRIR</span>`;
  document.body.appendChild(cta);

  // Trust bar (after hero)
  function injectTrustBar() {
    const hero = qs("header.hero");
    if (!hero || qs(".fx-trust")) return;
    const wrap = document.createElement("div");
    wrap.className = "fx-trust";
    wrap.innerHTML = `
      <div class="t"><span>✅ Entrega manual</span></div>
      <div class="t"><span>🔒 Não pedimos senha</span></div>
      <div class="t"><span>📲 Atendimento online</span></div>
    `;
    hero.insertAdjacentElement("afterend", wrap);
  }

  const audioCache = new Map();
  function playSound(path) {
    if (prefersReduced) return;
    if (!path) return;
    let a = audioCache.get(path);
    if (!a) { a = new Audio(path); a.preload = "auto"; audioCache.set(path, a); }
    try { a.currentTime = 0; a.volume = 0.65; a.play().catch(() => {}); } catch {}
  }

  function showFloatText(x, y, text, theme) {
    if (prefersReduced) return;
    const el = document.createElement("div");
    el.className = "fx-float";
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = theme.color;
    el.style.textShadow = `0 10px 22px rgba(0,0,0,0.60), 0 0 18px ${theme.glow}`;
    fxLayer.appendChild(el);

    const rise = 46 + Math.random() * 18;
    const drift = (Math.random() * 18) - 9;
    const dur = 650;

    const start = performance.now();
    const tick = (t) => {
      const k = clamp((t - start) / dur, 0, 1);
      const ease = 1 - Math.pow(1 - k, 3);
      el.style.opacity = `${Math.min(1, k * 2) * (1 - k)}`;
      el.style.transform = `translate(calc(-50% + ${drift * ease}px), calc(-50% + ${-rise * ease}px)) scale(${1 + 0.08 * ease})`;
      if (k < 1) requestAnimationFrame(tick); else el.remove();
    };
    requestAnimationFrame(tick);
  }

  function spawnParticles(x, y, theme) {
    if (prefersReduced) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.width = `${Math.random() * 6 + 4}px`;
      p.style.height = `${Math.random() * 6 + 4}px`;
      p.style.borderRadius = `${Math.random() > 0.35 ? "999px" : "4px"}`;
      p.style.background = theme.color;
      p.style.boxShadow = `0 0 18px ${theme.glow}`;
      p.style.opacity = "1";
      p.style.transform = "translate(-50%, -50%)";
      fxLayer.appendChild(p);

      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80 + 30;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const rot = (Math.random() * 180 - 90);
      const dur = Math.random() * 260 + 520;
      const start = performance.now();

      const tick = (t) => {
        const k = clamp((t - start) / dur, 0, 1);
        const ease = 1 - Math.pow(1 - k, 3);
        p.style.transform = `translate(calc(-50% + ${dx * ease}px), calc(-50% + ${(dy * ease) + (k * k * 22)}px)) rotate(${rot * ease}deg)`;
        p.style.opacity = `${1 - k}`;
        if (k < 1) requestAnimationFrame(tick); else p.remove();
      };
      requestAnimationFrame(tick);
    }
  }

  function openWhatsAppFor(btn) {
    const theme = getTheme(btn);
    const { title, price } = getProductInfo(btn);
    const orderId = makeOrderId();
    const link = buildWhatsAppLink({ title, price, orderId });

    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    spawnParticles(x, y, theme);
    showFloatText(x, y - 6, `${theme.emoji} Pedido #${orderId}`, theme);
    playSound(theme.sound);

    if (!prefersReduced && navigator.vibrate) {
      try { navigator.vibrate(18); } catch {}
    }
    window.open(link, "_blank", "noopener");
  }

  function initBuyButtons() {
    const btns = new Set([...qsa(".btn-comprar"), ...qsa(".card a")]);
    btns.forEach((btn) => {
      if (btn.dataset.fxBuyBound) return;
      if (btn.classList.contains("btn-whatsapp")) return;
      if (!btn.closest(".card")) return;

      btn.dataset.fxBuyBound = "1";
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        openWhatsAppFor(btn);
      });
    });
  }

  cta.addEventListener("click", () => {
    const orderId = makeOrderId();
    const msg =
      `Olá! Quero comprar na LALAUDC STORE.\n` +
      `• Pedido: #${orderId}\n\n` +
      `Me envie a tabela disponível ✅\n` +
      `Meu ID do Dragon City: ________\n\n` +
      `✅ Atendimento ONLINE\n` +
      `🔒 Não pedimos senha`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  function initTilt() {
    if (prefersReduced) return;

    const cards = qsa(".card").filter(c => !c.classList.contains("fx-tilt"));
    cards.forEach((card) => {
      card.classList.add("fx-tilt");

      let shine = qs(".fx-shine", card);
      if (!shine) { shine = document.createElement("div"); shine.className = "fx-shine"; card.appendChild(shine); }

      const maxTilt = 9;
      const onMove = (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width;
        const y = (ev.clientY - r.top) / r.height;

        const rotY = (x - 0.5) * (maxTilt * 2);
        const rotX = -(y - 0.5) * (maxTilt * 2);

        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
        shine.style.opacity = "1";

        const theme = getTheme(card);
        const angle = Math.atan2((y - 0.5), (x - 0.5)) * (180 / Math.PI);
        shine.style.background = `linear-gradient(${angle}deg, transparent 0%, ${theme.glow} 45%, transparent 70%)`;
      };

      const onLeave = () => { card.style.transform = ""; shine.style.opacity = "0"; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  function parseBRL(text) {
    const cleaned = text.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  function formatBRL(n) {
    try { return "R$ " + n.toLocaleString("pt-BR", { maximumFractionDigits: 0 }); }
    catch { return "R$ " + Math.round(n); }
  }
  function initCountUp() {
    const cards = qsa(".card");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const card = e.target;
        if (card.dataset.fxCounted) return;
        card.dataset.fxCounted = "1";

        const priceEl = qs("p", card);
        if (!priceEl) return;
        const val = parseBRL(priceEl.textContent || "");
        if (val == null) return;

        const span = document.createElement("span");
        span.textContent = formatBRL(0);
        span.style.display = "inline-block";
        span.style.minWidth = "64px";
        priceEl.textContent = "";
        priceEl.appendChild(span);

        if (prefersReduced) { span.textContent = formatBRL(val); return; }

        const dur = 650;
        const start = performance.now();
        const tick = (t) => {
          const k = clamp((t - start) / dur, 0, 1);
          const ease = 1 - Math.pow(1 - k, 3);
          span.textContent = formatBRL(val * ease);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.45 });

    cards.forEach(c => io.observe(c));
  }
  function buildNav() {
    const items = themes.map(t => ({ ...t, section: qs(t.sel) })).filter(x => x.section);
    if (!items.length) return;

    const nav = document.createElement("div");
    nav.className = "fx-nav";
    nav.setAttribute("aria-label", "Atalhos");

    items.forEach((it) => {
      const btn = document.createElement("button");
      btn.type = "button";

      const dot = document.createElement("span");
      dot.className = "fx-dot";
      dot.style.background = it.color;
      dot.style.boxShadow = `0 0 18px ${it.glow}`;

      const text = document.createElement("span");
      text.textContent = `${it.emoji} ${it.name}`;

      btn.appendChild(dot);
      btn.appendChild(text);
      btn.addEventListener("click", () => it.section.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }));
      nav.appendChild(btn);

      it._btn = btn;
    });

    document.body.appendChild(nav);

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const it = items.find(x => x.section === e.target);
        if (!it) return;
        if (e.isIntersecting) {
          items.forEach(x => x._btn?.classList.remove("active"));
          it._btn?.classList.add("active");
          progressFill.style.background = it.color;
          progressFill.style.boxShadow = `0 0 18px ${it.glow}`;
        }
      });
    }, { threshold: 0.35 });

    items.forEach(it => spy.observe(it.section));
  }

  function initProgressBar() {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressFill.style.width = `${pct.toFixed(2)}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initAll() {
    injectTrustBar();
    buildNav();
    initProgressBar();
    initTilt();
    initBuyButtons();
    initCountUp();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
  else initAll();

  const mo = new MutationObserver(() => {
    initTilt();
    initBuyButtons();
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  const a = new Audio("./sound/click.mp3");
  a.volume = 0;
  a.play().then(() => {
    a.pause();
    a.currentTime = 0;
  }).catch(() => {});
}

window.addEventListener("touchstart", unlockAudio, { once: true });
window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
});
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollIndicator.classList.add('hidden');
    } else {
      scrollIndicator.classList.remove('hidden');
    }
  });
}
