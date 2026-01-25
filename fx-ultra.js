/* =========================================================
   LALAUDC STORE — ULTRA v2 (JS ONLY, SAFE)
   - Desktop: 3D tilt + dynamic shadow + specular shine
             section spotlight + hero parallax + premium highlight
             stagger reveal + click micro-feedback
   - Mobile: lightweight mode (no heavy effects)
   - Does NOT modify your HTML/CSS files (injects small CSS)
   - Works alongside existing script.js + fx.js
========================================================= */
(() => {
  // ---------- Safety / Perf Gates ----------
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(pointer: coarse)").matches || matchMedia("(hover: none)").matches;
  const canDoHeavy = !prefersReduced && !isTouch;

  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // ---------- Themes by section ----------
  const THEMES = [
    { sel: ".produtos-gemas",     rgb: "181,140,255" }, // purple
    { sel: ".produtos-comida",    rgb: "255,90,90"   }, // red
    { sel: ".produtos-essencias", rgb: "26,255,156"  }, // green
    { sel: ".produtos-curingas",  rgb: "255,205,90"  }, // yellow
  ];

  function themeOf(el) {
    for (const t of THEMES) {
      if (el.closest?.(t.sel)) return t;
    }
    return { sel: "", rgb: "0,255,204" }; // fallback teal
  }

  // ---------- Inject CSS (isolated) ----------
  const css = document.createElement("style");
  css.textContent = `
    /* ULTRA: card layers */
    .ultra-tilt { transform-style: preserve-3d; will-change: transform; }
    .ultra-shine {
      position:absolute; inset:0; pointer-events:none;
      opacity:0; transition: opacity .16s ease;
      border-radius: inherit; mix-blend-mode: screen;
    }
    .ultra-shadow {
      position:absolute; inset:-16px; pointer-events:none;
      border-radius: inherit; z-index:-1;
      filter: blur(18px); opacity:0;
      transition: opacity .16s ease;
      will-change: transform, opacity;
    }

    /* ULTRA: section spotlight */
    .ultra-spot {
      position:absolute; inset:-90px;
      pointer-events:none; z-index:0;
      opacity:0; transition: opacity .25s ease;
      filter: blur(42px);
    }
    .ultra-spot.on { opacity:.78; }

    /* Keep section content above spotlight */
    .ultra-spot + * { position: relative; z-index: 2; }

    /* ULTRA: premium aura for destaque */
    .ultra-premium {
      position: relative;
      z-index: 1;
    }
    .ultra-premium::before{
      content:"";
      position:absolute; inset:-8px;
      border-radius: 20px;
      filter: blur(18px);
      opacity: .85;
      z-index: -1;
      animation: ultraPulse 2.8s ease-in-out infinite;
    }
    @keyframes ultraPulse{
      0%{ transform: scale(.98); opacity:.55; }
      50%{ transform: scale(1.03); opacity:.95; }
      100%{ transform: scale(.98); opacity:.55; }
    }

    /* ULTRA: click micro feedback */
    .ultra-press {
      transform: translateY(-2px) scale(1.01);
      transition: transform .12s ease;
    }

    /* ULTRA: subtle reveal */
    .ultra-reveal { opacity: 0; transform: translateY(14px); }
    .ultra-reveal.ultra-in { opacity: 1; transform: translateY(0); transition: opacity .55s ease, transform .55s ease; }

    /* Mobile: keep it light */
    @media (max-width: 768px){
      .ultra-spot { display:none !important; }
      .ultra-shadow { display:none !important; }
      .ultra-shine { display:none !important; }
    }
  `;
  document.head.appendChild(css);

  // ---------- Helper: rAF throttle ----------
  function rafThrottle(fn) {
    let running = false;
    let lastArgs = null;
    return (...args) => {
      lastArgs = args;
      if (running) return;
      running = true;
      requestAnimationFrame(() => {
        running = false;
        fn(...lastArgs);
      });
    };
  }

  // =========================================================
  // 1) HERO PARALLAX (desktop only, very subtle)
  // =========================================================
  const hero = qs("header.hero");
  if (hero && canDoHeavy) {
    const onScroll = rafThrottle(() => {
      const y = window.scrollY || 0;
      // small movement to feel "alive"
      hero.style.backgroundPosition = `center ${Math.round(y * 0.22)}px`;
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // =========================================================
  // 2) SECTION SPOTLIGHT (desktop only)
  // =========================================================
  if (canDoHeavy) {
    THEMES.forEach(t => {
      const sec = qs(t.sel);
      if (!sec) return;
      if (sec.querySelector(".ultra-spot")) return;

      // ensure positioning (without breaking layout)
      const computedPos = getComputedStyle(sec).position;
      if (computedPos === "static") sec.style.position = "relative";

      const spot = document.createElement("div");
      spot.className = "ultra-spot";
      spot.style.background = `radial-gradient(circle at 50% 50%,
        rgba(${t.rgb},0.30) 0%,
        rgba(${t.rgb},0.15) 38%,
        rgba(${t.rgb},0.06) 62%,
        rgba(${t.rgb},0) 78%)`;

      sec.insertBefore(spot, sec.firstChild);

      const onMove = rafThrottle((e) => {
        const r = sec.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        spot.style.background = `radial-gradient(circle at ${x}% ${y}%,
          rgba(${t.rgb},0.32) 0%,
          rgba(${t.rgb},0.16) 40%,
          rgba(${t.rgb},0.06) 64%,
          rgba(${t.rgb},0) 80%)`;
      });

      sec.addEventListener("mouseenter", () => spot.classList.add("on"));
      sec.addEventListener("mouseleave", () => spot.classList.remove("on"));
      sec.addEventListener("mousemove", onMove);
    });
  }

  // =========================================================
  // 3) TRUE 3D TILT on cards (desktop only)
  // =========================================================
  const cards = qsa(".card");
  cards.forEach(card => {
    if (card.dataset.ultraBound) return;
    card.dataset.ultraBound = "1";

    // Premium aura for "destaque" (desktop+mobile, but light)
    if (card.classList.contains("destaque")) {
      card.classList.add("ultra-premium");
      // colorize aura by section theme
      const t = themeOf(card);
      card.style.setProperty("--ultra-rgb", t.rgb);
      card.style.setProperty("--ultra-aura", `radial-gradient(circle, rgba(${t.rgb},0.75) 0%, rgba(${t.rgb},0.20) 42%, rgba(${t.rgb},0) 70%)`);
      // apply aura via inline to avoid CSS conflicts
      // (keeps your existing aura working; this boosts it)
      card.style.setProperty("--_ultraAura", `radial-gradient(circle, rgba(${t.rgb},0.75) 0%, rgba(${t.rgb},0.18) 48%, rgba(${t.rgb},0) 72%)`);
      card.style.setProperty("position", getComputedStyle(card).position === "static" ? "relative" : getComputedStyle(card).position);
      // overwrite pseudo background safely by setting a box-shadow fallback on mobile
      if (isTouch) {
        card.style.boxShadow = `0 0 28px rgba(${t.rgb},0.18), 0 14px 28px rgba(0,0,0,0.45)`;
      } else {
        // colorize the aura pseudo element by injecting style rule per card
        // (safe: unique selector via data-ultra-id)
        const id = "u" + Math.random().toString(16).slice(2);
        card.dataset.ultraId = id;
        const rule = document.createElement("style");
        rule.textContent = `.card[data-ultra-id="${id}"].ultra-premium::before{ background: ${card.style.getPropertyValue("--_ultraAura")} !important; }`;
        document.head.appendChild(rule);
      }
    }

    // Click micro press (desktop+mobile)
    card.addEventListener("pointerdown", () => card.classList.add("ultra-press"));
    card.addEventListener("pointerup", () => card.classList.remove("ultra-press"));
    card.addEventListener("pointercancel", () => card.classList.remove("ultra-press"));
    card.addEventListener("pointerleave", () => card.classList.remove("ultra-press"));

    // Heavy tilt disabled on touch/reduced motion
    if (!canDoHeavy) return;

    card.classList.add("ultra-tilt");

    // ensure relative positioning & hidden overflow for shine
    const computedPos = getComputedStyle(card).position;
    if (computedPos === "static") card.style.position = "relative";
    card.style.overflow = "hidden";

    // layers
    const shine = document.createElement("div");
    shine.className = "ultra-shine";
    const shadow = document.createElement("div");
    shadow.className = "ultra-shadow";

    card.appendChild(shine);
    card.appendChild(shadow);

    const t = themeOf(card);
    shadow.style.background = `radial-gradient(circle at 50% 50%,
      rgba(${t.rgb},0.40) 0%,
      rgba(${t.rgb},0.16) 46%,
      rgba(${t.rgb},0.00) 76%)`;

    const maxTilt = 10;
    const lift = 6;

    const onMove = rafThrottle((e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const rotY = (px - 0.5) * (maxTilt * 2);
      const rotX = -(py - 0.5) * (maxTilt * 2);

      card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(${-lift}px)`;

      // specular shine
      const ang = Math.atan2(py - 0.5, px - 0.5) * (180 / Math.PI) + 90;
      shine.style.opacity = "1";
      shine.style.background = `linear-gradient(${ang}deg,
        rgba(255,255,255,0) 0%,
        rgba(${t.rgb},0.22) 42%,
        rgba(255,255,255,0) 78%)`;

      // shadow follows
      shadow.style.opacity = "0.85";
      const sx = clamp((px - 0.5) * 30, -18, 18);
      const sy = clamp((py - 0.5) * 30, -18, 18);
      shadow.style.transform = `translate(${sx}px, ${sy}px)`;
    });

    const onLeave = () => {
      card.style.transform = "";
      shine.style.opacity = "0";
      shadow.style.opacity = "0";
      shadow.style.transform = "";
    };

    card.addEventListener("mouseenter", () => {
      shadow.style.opacity = "0.55";
      shine.style.opacity = "1";
    });
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });

  // =========================================================
  // 4) "Destaque" extra particles on click (desktop only, controlled)
  // =========================================================
  if (canDoHeavy) {
    const fxLayer = (() => {
      let el = qs("#ultra-layer");
      if (el) return el;
      el = document.createElement("div");
      el.id = "ultra-layer";
      el.style.position = "fixed";
      el.style.inset = "0";
      el.style.pointerEvents = "none";
      el.style.zIndex = "9997";
      el.style.overflow = "hidden";
      document.body.appendChild(el);
      return el;
    })();

    function burst(x, y, rgb) {
      const count = 10; // controlled (not heavy)
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.style.position = "absolute";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.width = `${Math.random() * 6 + 4}px`;
        p.style.height = `${Math.random() * 6 + 4}px`;
        p.style.borderRadius = Math.random() > 0.35 ? "999px" : "4px";
        p.style.background = `rgba(${rgb},0.95)`;
        p.style.boxShadow = `0 0 18px rgba(${rgb},0.30)`;
        p.style.transform = "translate(-50%, -50%)";
        p.style.willChange = "transform, opacity";
        fxLayer.appendChild(p);

        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 60 + 24;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        const dur = Math.random() * 220 + 450;
        const start = performance.now();

        const tick = (t) => {
          const k = clamp((t - start) / dur, 0, 1);
          const ease = 1 - Math.pow(1 - k, 3);
          p.style.transform = `translate(calc(-50% + ${dx * ease}px), calc(-50% + ${(dy * ease) + (k*k*16)}px))`;
          p.style.opacity = `${1 - k}`;
          if (k < 1) requestAnimationFrame(tick);
          else p.remove();
        };
        requestAnimationFrame(tick);
      }
    }

    // Only for "destaque" buy buttons
    const destaqueBtns = qsa(".card.destaque .btn-comprar, .card.destaque a.btn-comprar, .card.destaque a");
    destaqueBtns.forEach(btn => {
      if (btn.dataset.ultraBurst) return;
      btn.dataset.ultraBurst = "1";
      btn.addEventListener("click", () => {
        const r = btn.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const t = themeOf(btn);
        burst(x, y, t.rgb);
      }, { passive: true });
    });
  }

  // =========================================================
  // 5) Stagger reveal (safe, won't break existing animations)
  // =========================================================
  // We only add reveal to cards that are not already visible,
  // and we do nothing on reduced motion.
  if (!prefersReduced) {
    const targets = qsa(".card").filter(el => !el.classList.contains("ultra-reveal"));
    targets.forEach(el => el.classList.add("ultra-reveal"));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.ultraRevealed) return;
        el.dataset.ultraRevealed = "1";

        // stagger within the same row/container
        const siblings = el.parentElement ? qsa(".card", el.parentElement) : [el];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.min(idx * 70, 220)}ms`;
        el.classList.add("ultra-in");
      });
    }, { threshold: 0.2 });

    targets.forEach(el => io.observe(el));
  }

})();
