/* ============================================
   PETER PARKER PORTFOLIO — INTERACTIONS
   ============================================ */

(() => {
  'use strict';

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  /* ---------- CUSTOM CURSOR ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const customCursor = document.getElementById('customCursor');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let cursorX = mouseX, cursorY = mouseY;

  // Skip cursor on touch devices
  const isTouch = matchMedia('(hover: none)').matches || innerWidth < 900;
  if (!isTouch) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hover state for interactive elements
    const hoverables = document.querySelectorAll('a, button, [data-magnetic], input, textarea, select, .power-card, .mission-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        customCursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        customCursor.classList.remove('hover');
      });
    });
  }

  /* ---------- WEB SHOOTING CANVAS ---------- */
  const canvas = document.getElementById('webCanvas');
  const ctx = canvas.getContext('2d');
  let canvasW, canvasH;

  function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth * window.devicePixelRatio;
    canvasH = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Web particles
  const webs = [];
  const MAX_WEBS = 80;

  class Web {
    constructor(x, y, angle) {
      this.x = x;
      this.y = y;
      this.startX = x;
      this.startY = y;
      this.vx = Math.cos(angle) * (2 + Math.random() * 3);
      this.vy = Math.sin(angle) * (2 + Math.random() * 3);
      this.life = 1;
      this.decay = 0.012 + Math.random() * 0.008;
      this.size = 1 + Math.random() * 1.5;
      this.history = [{ x, y }];
      this.maxHistory = 8;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.vy += 0.05; // slight gravity
      this.life -= this.decay;
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) this.history.shift();
      return this.life > 0 && (this.x > 0 && this.x < window.innerWidth);
    }
    draw() {
      if (this.history.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.7})`;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw connecting web strands to other webs (subtle)
      if (Math.random() > 0.95) {
        for (let other of webs) {
          if (other === this) continue;
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 60 && dist > 0) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(226, 54, 54, ${(1 - dist/60) * 0.15 * this.life})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
  }

  // Shooting on mouse move
  let lastShoot = 0;
  function shootWeb(x, y) {
    const now = Date.now();
    if (now - lastShoot < 16) return; // throttle
    lastShoot = now;
    if (webs.length >= MAX_WEBS) webs.shift();
    // Web shoots outward from center
    const angle = Math.random() * Math.PI * 2;
    webs.push(new Web(x, y, angle));
  }

  document.addEventListener('mousemove', (e) => {
    if (isTouch) return;
    if (Math.random() > 0.6) shootWeb(e.clientX, e.clientY);
  });

  // Click to shoot burst
  document.addEventListener('click', (e) => {
    if (isTouch) return;
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const angle = (i / 12) * Math.PI * 2;
        if (webs.length >= MAX_WEBS) webs.shift();
        webs.push(new Web(e.clientX, e.clientY, angle));
      }, i * 20);
    }
  });

  // Canvas render loop
  function renderWebs() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = webs.length - 1; i >= 0; i--) {
      if (!webs[i].update()) {
        webs.splice(i, 1);
      } else {
        webs[i].draw();
      }
    }
    requestAnimationFrame(renderWebs);
  }
  renderWebs();

  /* ---------- CURSOR ANIMATION ---------- */
  function animateCursor() {
    if (isTouch) return;
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ---------- NAV SCROLL ---------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    lastScroll = y;
  });

  /* ---------- MOBILE BURGER ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---------- PARALLAX ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + scrollY;
      // Only animate if in viewport
      if (rect.bottom > -200 && rect.top < vh + 200) {
        const offset = (scrollY + vh / 2 - elTop) * speed * 0.3;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- SPIDEY SWING ANIMATION ---------- */
  const spideyWrap = document.querySelector('.spidey-wrap');
  if (spideyWrap) {
    let swingProgress = 0;
    function updateSpidey() {
      const scrollY = window.scrollY;
      // Tilt the spidey based on scroll velocity
      const tilt = Math.min(Math.max(scrollY * 0.02, -25), 25);
      spideyWrap.style.setProperty('--tilt', tilt + 'deg');
    }
    window.addEventListener('scroll', updateSpidey, { passive: true });
  }

  /* ---------- POWER BARS FILL ON REVEAL ---------- */
  const powerBars = document.querySelectorAll('.power-bar span');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.dataset.fill;
        entry.target.style.width = fill + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  powerBars.forEach(bar => barObserver.observe(bar));

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(eased * target);
          el.textContent = value;
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target;
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- MAGNETIC BUTTONS ---------- */
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  if (!isTouch) {
    magneticEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.3;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------- TILT ON POWER CARDS ---------- */
  const cards = document.querySelectorAll('.power-card, .mission-card');
  if (!isTouch) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -4;
        const rotateY = (x - 0.5) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- HERO TITLE LETTER ANIMATION ---------- */
  const titleLines = document.querySelectorAll('.title-line');
  titleLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(80px) rotateX(-40deg)';
    line.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0) rotateX(0)';
    }, 200 + i * 200);
  });

  /* ---------- SPIDER WEB GENERATOR (background detail) ---------- */
  // Add subtle ambient web particles in hero
  const hero = document.querySelector('.hero');
  if (hero) {
    const ambientCanvas = document.createElement('canvas');
    ambientCanvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 2;
      opacity: 0.4;
    `;
    hero.appendChild(ambientCanvas);
    const actx = ambientCanvas.getContext('2d');
    function resizeAmbient() {
      ambientCanvas.width = hero.offsetWidth * devicePixelRatio;
      ambientCanvas.height = hero.offsetHeight * devicePixelRatio;
      actx.scale(devicePixelRatio, devicePixelRatio);
    }
    resizeAmbient();
    window.addEventListener('resize', resizeAmbient);

    // Static spider web in corner
    function drawCornerWeb() {
      const w = hero.offsetWidth;
      const h = hero.offsetHeight;
      actx.clearRect(0, 0, w, h);
      // Top-left web
      actx.save();
      actx.translate(0, 0);
      actx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      actx.lineWidth = 0.5;
      // Radial strands
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI / 2;
        actx.beginPath();
        actx.moveTo(0, 0);
        actx.lineTo(Math.cos(angle) * 300, Math.sin(angle) * 300);
        actx.stroke();
      }
      // Concentric arcs
      for (let r = 30; r < 300; r += 30) {
        actx.beginPath();
        for (let i = 0; i <= 16; i++) {
          const a = (i / 16) * Math.PI / 2;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) actx.moveTo(x, y);
          else actx.lineTo(x, y);
        }
        actx.stroke();
      }
      actx.restore();

      // Top-right web
      actx.save();
      actx.translate(w, 0);
      actx.scale(-1, 1);
      actx.strokeStyle = 'rgba(226, 54, 54, 0.15)';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI / 2;
        actx.beginPath();
        actx.moveTo(0, 0);
        actx.lineTo(Math.cos(angle) * 250, Math.sin(angle) * 250);
        actx.stroke();
      }
      for (let r = 30; r < 250; r += 30) {
        actx.beginPath();
        for (let i = 0; i <= 16; i++) {
          const a = (i / 16) * Math.PI / 2;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) actx.moveTo(x, y);
          else actx.lineTo(x, y);
        }
        actx.stroke();
      }
      actx.restore();
    }
    drawCornerWeb();
    window.addEventListener('resize', drawCornerWeb);
  }

  /* ---------- KEYBOARD EASTER EGG ---------- */
  let thwipBuffer = [];
  document.addEventListener('keydown', (e) => {
    thwipBuffer.push(e.key.toLowerCase());
    if (thwipBuffer.length > 6) thwipBuffer.shift();
    if (thwipBuffer.join('').includes('thwip')) {
      // Burst of webs from center
      const cx = innerWidth / 2, cy = innerHeight / 2;
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        webs.push(new Web(cx, cy, angle));
      }
      thwipBuffer = [];
    }
  });

  console.log('%c🕷 THWIP!', 'color: #e23636; font-size: 32px; font-weight: bold;');
  console.log('%cType "thwip" anywhere for a surprise.', 'color: #888; font-size: 14px;');
})();
