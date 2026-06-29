// ===================================================================
//  MAIN.JS — The Pocket Judge
//  Cinematic museum experience — hardened + polished build
// ===================================================================

document.documentElement.classList.add("js-ready");

// ===================================================================
//  SAFE BOOT
// ===================================================================
function forceRevealEverything() {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main-content");
  if (loader) loader.style.display = "none";
  if (main) main.style.opacity = "1";
  document.documentElement.classList.add("lib-failed");
  document.documentElement.classList.remove("js-ready");
}

function bootSite() {
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  if (!hasGSAP || !hasScrollTrigger || !hasLenis) {
    console.warn(
      "Pocket Judge: animation libraries failed to load (CDN issue?). Falling back to a static, fully-visible layout.",
    );
    forceRevealEverything();
    return;
  }

  try {
    runApp();
  } catch (err) {
    console.error("Pocket Judge: unexpected error during boot.", err);
    forceRevealEverything();
  }
}

// ===================================================================
//  APP
// ===================================================================
function runApp() {
  gsap.registerPlugin(ScrollTrigger);

  // -----------------------------------------------------------------
  //  LENIS SMOOTH SCROLL
  // -----------------------------------------------------------------
  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  lenis.on("scroll", ScrollTrigger.update);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  // -----------------------------------------------------------------
  //  DUST PARTICLE CANVAS
  // -----------------------------------------------------------------
  let stopDust = null;

  function initDustParticles() {
    const canvas = document.getElementById("dust-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particleCount = window.innerWidth < 700 ? 40 : 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.18,
      speedY: -(Math.random() * 0.22 + 0.05),
      alpha: Math.random() * 0.35 + 0.05,
    }));

    let running = true;
    let rafId = null;

    function drawDust() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      });
      rafId = requestAnimationFrame(drawDust);
    }
    drawDust();

    stopDust = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }

  // -----------------------------------------------------------------
  //  LOADER PORTRAIT FRAMES
  // -----------------------------------------------------------------
  function animateLoaderFrames() {
    const frames = document.querySelectorAll(".lframe");

    frames.forEach((frame, i) => {
      if (getComputedStyle(frame).display === "none") return;

      const delay = i * 0.22;

      gsap.to(frame, {
        opacity: 1,
        duration: 1.6,
        delay,
        ease: "power2.out",
      });

      gsap.to(frame, {
        y: `${(Math.random() - 0.5) * 22}px`,
        x: `${(Math.random() - 0.5) * 10}px`,
        rotation: `${(Math.random() - 0.5) * 3}deg`,
        duration: 4 + Math.random() * 3,
        delay,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }

  // -----------------------------------------------------------------
  //  HALL OF COURAGE — resolve pedestal portraits
  // -----------------------------------------------------------------
  function resolvePedestalPortraits() {
    const resolver = window.ImageResolver;
    if (!resolver) return;

    document
      .querySelectorAll(".exhibit-pedestal .exhibit-portrait-img")
      .forEach((img) => {
        const original = img.getAttribute("src");
        if (!original) return;
        resolver.applyResolvedImage(img, original, {
          kind: "portrait",
          alt: img.alt,
        });
      });
  }

  resolvePedestalPortraits();

  // -----------------------------------------------------------------
  //  LOADER STATUS MESSAGES
  // -----------------------------------------------------------------
  const STATUS_MESSAGES = [
    "INITIALISING EXHIBIT",
    "LOADING PORTRAITS",
    "PREPARING ARTIFACTS",
    "CURATING TIMELINE",
    "ENTERING THE MUSEUM",
  ];

  function updateLoaderStatus(pct) {
    const el = document.getElementById("loaderStatus");
    if (!el) return;
    const idx = Math.min(Math.floor(pct / 22), STATUS_MESSAGES.length - 1);
    if (el.textContent !== STATUS_MESSAGES[idx]) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          el.textContent = STATUS_MESSAGES[idx];
          gsap.to(el, { opacity: 1, duration: 0.3 });
        },
      });
    }
  }

  // -----------------------------------------------------------------
  //  LOADER SEQUENCE
  // -----------------------------------------------------------------
  function initLoader() {
    initDustParticles();
    animateLoaderFrames();

    const loaderBar = document.getElementById("loader-bar");
    const loaderPct = document.getElementById("loader-percent");
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("main-content");

    const loaderImages = Array.from(document.querySelectorAll(".lframe img"));
    const resolver = window.ImageResolver;

    const resolveLoaderImages = resolver
      ? Promise.all(
          loaderImages.map((img) => {
            const original = img.getAttribute("data-original-src") || img.src;
            img.setAttribute("data-original-src", original);
            return resolver.resolveImage(original).then((resolved) => {
              img.src = resolved || resolver.FALLBACK_PORTRAIT;
              if (!resolved)
                img.closest(".lframe")?.classList.add("media-missing");
            });
          }),
        )
      : Promise.resolve();

    let imagesReady = false;

    Promise.race([
      resolveLoaderImages.then(() =>
        Promise.all(
          loaderImages.map(
            (img) =>
              new Promise((res) => {
                if (img.complete) return res();
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
              }),
          ),
        ),
      ),
      new Promise((res) => setTimeout(res, 6000)),
    ]).then(() => {
      imagesReady = true;
    });

    let progress = 0;

    const loadInterval = setInterval(() => {
      progress += Math.random() * 5 + 1.5;

      if (progress >= 100 && imagesReady) {
        progress = 100;
        clearInterval(loadInterval);

        loaderBar.style.width = "100%";
        loaderPct.textContent = "100%";
        updateLoaderStatus(100);

        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              if (stopDust) stopDust();
              gsap.killTweensOf(".lframe");
              loader.style.display = "none";
              gsap.to(mainContent, {
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
                onComplete: initScrollAnimations,
              });
            },
          });

          tl.to(".lframe", {
            opacity: 0,
            y: "-=20",
            stagger: 0.06,
            duration: 0.8,
            ease: "power2.in",
          });

          tl.to(
            loader,
            {
              opacity: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "-=0.3",
          );
        }, 600);
      } else if (progress >= 100) {
        loaderBar.style.width = "99%";
        loaderPct.textContent = "99%";
      } else {
        loaderBar.style.width = progress + "%";
        loaderPct.textContent = Math.floor(progress) + "%";
        updateLoaderStatus(progress);
      }
    }, 60);
  }

  // -----------------------------------------------------------------
  //  SCROLL ANIMATIONS
  // -----------------------------------------------------------------
  function initScrollAnimations() {
    document.querySelectorAll(".cinematic-word").forEach((el) => {
      gsap.set(el, { opacity: 0, y: 80, filter: "blur(8px)" });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 35%",
          toggleActions: "play none none reverse",
        },
      });
    });

    document.querySelectorAll(".cinematic-paragraph").forEach((el) => {
      gsap.set(el, { opacity: 0, y: 50, filter: "blur(4px)" });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    });

    gsap.set(".hero-badge", { opacity: 0, y: 20 });
    gsap.to(".hero-badge", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: "#hero", start: "top 65%" },
    });

    gsap.set("#hero-title", { opacity: 0, y: 50 });
    gsap.to("#hero-title", {
      opacity: 1,
      y: 0,
      duration: 1.3,
      delay: 0.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "#hero", start: "top 65%" },
    });

    gsap.set("#hero-sub", { opacity: 0, y: 20 });
    gsap.to("#hero-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.45,
      ease: "power2.out",
      scrollTrigger: { trigger: "#hero", start: "top 65%" },
    });

    gsap.set(".hero-buttons", { opacity: 0, y: 20 });
    gsap.to(".hero-buttons", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.65,
      ease: "power2.out",
      scrollTrigger: { trigger: "#hero", start: "top 65%" },
    });

    gsap.set(".hero-scroll-hint", { opacity: 0 });
    gsap.to(".hero-scroll-hint", {
      opacity: 1,
      duration: 1.2,
      delay: 1.2,
      ease: "power2.out",
      scrollTrigger: { trigger: "#hero", start: "top 65%" },
    });

    // BUG FIX: .chat-box removed from gsap.set and its gsap.to removed entirely.
    // Animating .chat-box (the AI response container's parent) caused ScrollTrigger
    // to reset it to opacity:0 on layout reflow after renderResponse() changed its
    // height — making the rendered AI answer disappear. The heading and subtitle
    // can still animate in; the chat-box itself must always remain visible.
    gsap.set("#assistant h2, #assistant .section-sub", {
      opacity: 0,
      y: 40,
    });
    gsap.to("#assistant h2", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: "#assistant", start: "top 65%" },
    });
    gsap.to("#assistant .section-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: "#assistant", start: "top 65%" },
    });

    gsap.to(".rights-heading", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "#rights", start: "top 65%" },
    });
    gsap.to(".rights-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: "#rights", start: "top 65%" },
    });
    gsap.to(".rights-card", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: ".rights-grid", start: "top 70%" },
    });

    gsap.to(".courage-heading", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "#courage", start: "top 65%" },
    });
    gsap.to(".courage-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: "#courage", start: "top 65%" },
    });
    gsap.to(".courage-divider", {
      opacity: 1,
      duration: 1.2,
      delay: 0.4,
      ease: "power2.out",
      scrollTrigger: { trigger: "#courage", start: "top 65%" },
    });

    gsap.to(".exhibit-pedestal", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: { trigger: ".gallery-floor", start: "top 70%" },
    });

    gsap.to(".emergency-heading", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "#emergency", start: "top 65%" },
    });
    gsap.to(".emergency-sub", {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: "#emergency", start: "top 65%" },
    });
    gsap.to(".emergency-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: ".emergency-grid", start: "top 70%" },
    });

    ScrollTrigger.refresh();
  }

  // -----------------------------------------------------------------
  //  RIGHTS EXPAND / COLLAPSE
  // -----------------------------------------------------------------
  document.querySelectorAll(".rights-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    const btn = card.querySelector(".rights-expand-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");

    const toggle = () => {
      const isOpen = card.classList.contains("open");
      document.querySelectorAll(".rights-card").forEach((c) => {
        c.classList.remove("open");
        const b = c.querySelector(".rights-expand-btn");
        if (b) {
          b.textContent = "Know Your Rights →";
          b.setAttribute("aria-expanded", "false");
        }
        const detail = c.querySelector(".rights-detail");
        if (detail) detail.style.maxHeight = "0px";
      });

      if (!isOpen) {
        card.classList.add("open");
        if (btn) {
          btn.textContent = "Close ↑";
          btn.setAttribute("aria-expanded", "true");
        }
        const detail = card.querySelector(".rights-detail");
        if (detail) detail.style.maxHeight = detail.scrollHeight + "px";
      }
    };

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  // -----------------------------------------------------------------
  //  SCROLL TO SECTIONS
  // -----------------------------------------------------------------
  const askBtn = document.getElementById("askBtn");
  const exploreBtn = document.getElementById("exploreBtn");

  if (askBtn) {
    askBtn.addEventListener("click", () =>
      lenis.scrollTo("#assistant", { offset: -60, duration: 2 }),
    );
  }
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () =>
      lenis.scrollTo("#rights", { offset: -60, duration: 2 }),
    );
  }

  // NOTE: Query chips and AI assistant are initialized in initAIAssistant()
  // below, which is called unconditionally so they work even if CDN libraries fail.

  // -----------------------------------------------------------------
  //  AI LEGAL ASSISTANT — initialized via initAIAssistant() below
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  //  DIGITAL EXHIBIT OVERLAY + ARTIFACT LIGHTBOX
  // -----------------------------------------------------------------
  const overlay = document.getElementById("exhibitOverlay");
  const exhibitPanel = document.getElementById("exhibitPanel");
  const exhibitClose = document.getElementById("exhibitClose");
  const artifactLightbox = document.getElementById("artifactLightbox");
  const artifactClose = document.getElementById("artifactClose");

  let currentLeaderKey = null;

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function lockScroll() {
    lenis.stop();
    document.body.classList.add("overlay-open");
  }

  function unlockScrollIfNothingOpen() {
    const exhibitOpen = overlay.classList.contains("active");
    const lightboxOpen = artifactLightbox.classList.contains("active");
    if (!exhibitOpen && !lightboxOpen) {
      lenis.start();
      document.body.classList.remove("overlay-open");
    }
  }

  // ---- Open exhibit ----
  function openExhibit(leaderKey) {
    const data = window.LEADERS_DATA && window.LEADERS_DATA[leaderKey];
    if (!data) {
      console.warn(`Pocket Judge: no data found for leader key "${leaderKey}"`);
      return;
    }
    currentLeaderKey = leaderKey;

    try {
      populateExhibit(data);
    } catch (err) {
      console.error("Pocket Judge: failed to populate exhibit content.", err);
    }

    lockScroll();
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");

    gsap.killTweensOf(exhibitPanel);
    gsap.fromTo(
      exhibitPanel,
      { opacity: 0, scale: 0.93, y: 28 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" },
    );

    setTimeout(animateArtifactsIn, 400);
  }

  // ---- Close exhibit ----
  function closeExhibit() {
    gsap.to(exhibitPanel, {
      opacity: 0,
      scale: 0.94,
      y: 20,
      duration: 0.45,
      ease: "power2.in",
      onComplete: () => {
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        unlockScrollIfNothingOpen();
        currentLeaderKey = null;
      },
    });
  }

  // ---- Populate exhibit ----
  function populateExhibit(data) {
    const portraitEl = document.getElementById("exhibitPortrait");
    const resolver = window.ImageResolver;
    if (resolver) {
      resolver.applyResolvedImage(portraitEl, data.portrait, {
        kind: "portrait",
        alt: data.name || "Unknown",
      });
    } else {
      portraitEl.src =
        data.portrait || "assets/images/fallback/portrait-fallback.jpg";
      portraitEl.alt = data.name || "Unknown";
    }

    document.getElementById("exhibitYears").textContent = data.years || "";
    document.getElementById("exhibitName").textContent =
      data.name || "Untitled Exhibit";
    document.getElementById("exhibitTitle").textContent = data.title || "";
    document.getElementById("exhibitBio").textContent =
      data.bio || "Biography coming soon.";

    const tagsEl = document.getElementById("exhibitTags");
    tagsEl.innerHTML = (data.tags || [])
      .map((t) => `<span class="exhibit-tag">${escapeAttr(t)}</span>`)
      .join("");

    buildArtifacts(data.artifacts || []);
    buildTimeline(data.timeline || []);

    switchTab("artifacts");
  }

  // ---- Build artifacts grid ----
  function buildArtifacts(artifacts) {
    const grid = document.getElementById("artifactsGrid");
    const resolver = window.ImageResolver;

    grid.innerHTML = artifacts
      .map(
        (a) => `
      <div class="artifact-card" tabindex="0" role="button"
           data-artifact-id="${escapeAttr(a.id)}"
           data-title="${escapeAttr(a.name)}"
           data-desc="${escapeAttr(a.description)}">
        <div class="artifact-card-media">
          <img class="artifact-card-img img-resolving" src="" alt="${escapeAttr(a.name)}" loading="lazy" />
          <div class="artifact-gallery-badge" hidden></div>
        </div>
        <div class="artifact-card-label">
          <span class="artifact-card-name">${escapeAttr(a.name.toUpperCase())}</span>
        </div>
      </div>
    `,
      )
      .join("");

    const cards = Array.from(grid.querySelectorAll(".artifact-card"));

    cards.forEach((card, idx) => {
      const artifact = artifacts[idx];
      const imgEl = card.querySelector(".artifact-card-img");
      const badge = card.querySelector(".artifact-gallery-badge");

      const wireClick = (galleryUrls) => {
        const open = () =>
          openArtifactLightbox(
            galleryUrls,
            card.dataset.title,
            card.dataset.desc,
          );
        card.addEventListener("click", open);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        });
      };

      if (!resolver) {
        imgEl.src = artifact.image;
        imgEl.classList.remove("img-resolving");
        imgEl.addEventListener(
          "error",
          () => card.classList.add("artifact-missing"),
          { once: true },
        );
        wireClick([artifact.image]);
        return;
      }

      const allCandidates = Array.from(
        new Set([artifact.image, ...(artifact.images || [])].filter(Boolean)),
      );

      resolver.resolveGalleryFromList(allCandidates).then((galleryUrls) => {
        if (!galleryUrls.length) {
          imgEl.src = resolver.FALLBACK_ARTIFACT;
          imgEl.classList.remove("img-resolving");
          imgEl.classList.add("img-loaded", "img-fallback");
          card.classList.add("artifact-missing");
          wireClick([resolver.FALLBACK_ARTIFACT]);
          return;
        }

        imgEl.src = galleryUrls[0];
        const settle = () => {
          imgEl.classList.remove("img-resolving");
          imgEl.classList.add("img-loaded");
        };
        if (imgEl.complete) settle();
        else imgEl.addEventListener("load", settle, { once: true });

        if (galleryUrls.length > 1) {
          badge.hidden = false;
          badge.textContent = `1 / ${galleryUrls.length}`;
          card.classList.add("has-gallery");
        }

        wireClick(galleryUrls);
      });
    });
  }

  // ---- Animate artifact cards in ----
  function animateArtifactsIn() {
    const cards = document.querySelectorAll("#artifactsGrid .artifact-card");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      },
    );
  }

  // ---- Build timeline ----
  // Timeline images now open in the existing artifact lightbox when clicked.
  function buildTimeline(events) {
    const track = document.getElementById("timelineTrack");
    track.innerHTML = events
      .map(
        (ev) => `
      <div class="timeline-event">
        <div class="timeline-dot"></div>
        <img class="timeline-img img-resolving"
             src=""
             data-original-img="${escapeAttr(ev.image)}"
             alt="${escapeAttr(ev.title)}"
             loading="lazy"
             tabindex="0"
             role="button"
             aria-label="View image: ${escapeAttr(ev.title)}" />
        <div class="timeline-content">
          <div class="timeline-year">${escapeAttr(ev.year)}</div>
          <div class="timeline-title">${escapeAttr(ev.title)}</div>
          <p class="timeline-story">${escapeAttr(ev.story)}</p>
        </div>
      </div>
    `,
      )
      .join("");

    const resolver = window.ImageResolver;

    track.querySelectorAll(".timeline-img").forEach((img) => {
      const original = img.getAttribute("data-original-img");
      if (!original) return;

      if (resolver) {
        // Resolve the image, then wire up click to open in lightbox
        resolver.resolveImage(original).then((resolved) => {
          const finalSrc = resolved || resolver.FALLBACK_ARTIFACT;
          const markMissing = !resolved;

          img.src = finalSrc;
          const settle = () => {
            img.classList.remove("img-resolving");
            img.classList.add("img-loaded");
            if (markMissing) {
              img.classList.add("img-fallback");
              img.closest(".timeline-event")?.classList.add("media-missing");
            }
          };
          if (img.complete) settle();
          else {
            img.addEventListener("load", settle, { once: true });
            img.addEventListener("error", settle, { once: true });
          }

          // Wire lightbox — use the resolved URL
          const openInLightbox = () => {
            const titleEl = img
              .closest(".timeline-event")
              ?.querySelector(".timeline-title");
            const yearEl = img
              .closest(".timeline-event")
              ?.querySelector(".timeline-year");
            const storyEl = img
              .closest(".timeline-event")
              ?.querySelector(".timeline-story");

            const title = [yearEl?.textContent, titleEl?.textContent]
              .filter(Boolean)
              .join(" — ");
            const desc = storyEl?.textContent || "";

            openArtifactLightbox([finalSrc], title, desc);
          };

          img.addEventListener("click", openInLightbox);
          img.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openInLightbox();
            }
          });
        });
      } else {
        // No resolver — fall back to plain img
        img.src = original;
        img.classList.remove("img-resolving");
        img.addEventListener(
          "error",
          () => {
            img.closest(".timeline-event")?.classList.add("media-missing");
          },
          { once: true },
        );

        const openInLightbox = () => {
          const titleEl = img
            .closest(".timeline-event")
            ?.querySelector(".timeline-title");
          const yearEl = img
            .closest(".timeline-event")
            ?.querySelector(".timeline-year");
          const storyEl = img
            .closest(".timeline-event")
            ?.querySelector(".timeline-story");

          const title = [yearEl?.textContent, titleEl?.textContent]
            .filter(Boolean)
            .join(" — ");
          const desc = storyEl?.textContent || "";

          openArtifactLightbox([original], title, desc);
        };

        img.addEventListener("click", openInLightbox);
        img.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openInLightbox();
          }
        });
      }
    });
  }

  // ---- Animate timeline events in ----
  function animateTimelineIn() {
    const events = document.querySelectorAll("#timelineTrack .timeline-event");
    if (!events.length) return;
    gsap.fromTo(
      events,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.55, stagger: 0.1, ease: "power2.out" },
    );
  }

  // ---- Tab switching ----
  function switchTab(tabName) {
    document.querySelectorAll(".exhibit-tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    document
      .querySelectorAll(".exhibit-tab-content")
      .forEach((c) => c.classList.remove("active"));

    const activeTab = document.querySelector(
      `.exhibit-tab[data-tab="${tabName}"]`,
    );
    const activeContent = document.getElementById(`tab-${tabName}`);

    if (activeTab) {
      activeTab.classList.add("active");
      activeTab.setAttribute("aria-selected", "true");
    }
    if (activeContent) activeContent.classList.add("active");

    if (tabName === "artifacts") {
      setTimeout(animateArtifactsIn, 80);
    } else if (tabName === "timeline") {
      setTimeout(animateTimelineIn, 80);
    }
  }

  document.querySelectorAll(".exhibit-tab").forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  exhibitClose.addEventListener("click", closeExhibit);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeExhibit();
  });

  // ---- Gallery pedestal click + keyboard ----
  document.querySelectorAll(".exhibit-pedestal").forEach((pedestal) => {
    pedestal.setAttribute("tabindex", "0");
    pedestal.setAttribute("role", "button");
    pedestal.setAttribute(
      "aria-label",
      `View exhibit: ${pedestal.querySelector(".exhibit-name")?.textContent || "leader"}`,
    );

    const open = () => openExhibit(pedestal.dataset.leader);
    pedestal.addEventListener("click", open);
    pedestal.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // -----------------------------------------------------------------
  //  ARTIFACT LIGHTBOX
  // -----------------------------------------------------------------
  let lightboxImages = [];
  let lightboxIndex = 0;

  function renderLightboxMainImage() {
    const img = document.getElementById("artifactLightboxImg");
    const url = lightboxImages[lightboxIndex];
    if (!url) return;

    img.classList.add("img-resolving");
    img.src = url;
    const settle = () => img.classList.remove("img-resolving");
    if (img.complete) settle();
    else img.addEventListener("load", settle, { once: true });

    document.querySelectorAll(".artifact-lightbox-thumb").forEach((t, i) => {
      t.classList.toggle("active", i === lightboxIndex);
    });

    const counter = document.getElementById("artifactLightboxCounter");
    if (counter) {
      if (lightboxImages.length > 1) {
        counter.hidden = false;
        counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
      } else {
        counter.hidden = true;
      }
    }
  }

  function goToLightboxImage(i) {
    if (!lightboxImages.length) return;
    lightboxIndex =
      ((i % lightboxImages.length) + lightboxImages.length) %
      lightboxImages.length;
    renderLightboxMainImage();
  }

  function buildLightboxThumbStrip() {
    const strip = document.getElementById("artifactLightboxThumbs");
    const content = document.querySelector(".artifact-lightbox-content");
    if (!strip) return;

    const isGallery = lightboxImages.length > 1;
    if (content) content.classList.toggle("has-gallery", isGallery);

    if (!isGallery) {
      strip.hidden = true;
      strip.innerHTML = "";
      return;
    }

    strip.hidden = false;
    strip.innerHTML = lightboxImages
      .map(
        (url, i) =>
          `<button class="artifact-lightbox-thumb${i === 0 ? " active" : ""}" data-index="${i}" aria-label="View image ${i + 1}">
             <img src="${escapeAttr(url)}" alt="" loading="lazy" />
           </button>`,
      )
      .join("");

    strip.querySelectorAll(".artifact-lightbox-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () =>
        goToLightboxImage(Number(thumb.dataset.index)),
      );
    });
  }

  function openArtifactLightbox(images, title, desc) {
    lockScroll();

    lightboxImages = Array.isArray(images)
      ? images.filter(Boolean)
      : [images].filter(Boolean);
    if (!lightboxImages.length) {
      lightboxImages = [
        window.ImageResolver ? window.ImageResolver.FALLBACK_ARTIFACT : "",
      ];
    }
    lightboxIndex = 0;

    renderLightboxMainImage();
    buildLightboxThumbStrip();

    document.getElementById("artifactLightboxTitle").textContent = title;
    document.getElementById("artifactLightboxDesc").textContent = desc;

    artifactLightbox.classList.add("active");
    artifactLightbox.setAttribute("aria-hidden", "false");

    gsap.fromTo(
      ".artifact-lightbox-bg",
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
    );
    gsap.fromTo(
      ".artifact-lightbox-content",
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
    );
  }

  function closeArtifactLightbox() {
    gsap.to(".artifact-lightbox-content", {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(".artifact-lightbox-bg", {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        artifactLightbox.classList.remove("active");
        artifactLightbox.setAttribute("aria-hidden", "true");
        document.getElementById("artifactLightboxImg").src = "";
        lightboxImages = [];
        lightboxIndex = 0;
        unlockScrollIfNothingOpen();
      },
    });
  }

  artifactClose.addEventListener("click", closeArtifactLightbox);

  artifactLightbox.addEventListener("click", (e) => {
    if (
      e.target === artifactLightbox ||
      e.target.classList.contains("artifact-lightbox-bg")
    ) {
      closeArtifactLightbox();
    }
  });

  const lightboxPrev = document.getElementById("artifactLightboxPrev");
  const lightboxNext = document.getElementById("artifactLightboxNext");
  if (lightboxPrev)
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      goToLightboxImage(lightboxIndex - 1);
    });
  if (lightboxNext)
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      goToLightboxImage(lightboxIndex + 1);
    });

  document.addEventListener("keydown", (e) => {
    if (!artifactLightbox.classList.contains("active")) return;
    if (e.key === "ArrowRight") goToLightboxImage(lightboxIndex + 1);
    if (e.key === "ArrowLeft") goToLightboxImage(lightboxIndex - 1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (artifactLightbox.classList.contains("active")) {
        closeArtifactLightbox();
      } else if (overlay.classList.contains("active")) {
        closeExhibit();
      }
    }
  });

  // -----------------------------------------------------------------
  //  BOOT
  // -----------------------------------------------------------------
  initLoader();

  if (window.ImageResolver) {
    window.ImageResolver.auditLeaderData();
  }
}

bootSite();

// ===================================================================
//  AI LEGAL ASSISTANT — initialized unconditionally so it works even
//  when CDN animation libraries (GSAP / Lenis) fail to load.
// ===================================================================
function initAIAssistant() {
  // -----------------------------------------------------------------
  //  QUERY CHIPS
  // -----------------------------------------------------------------
  document.querySelectorAll(".query-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const textarea = document.getElementById("userQuery");
      if (textarea) {
        textarea.value = chip.textContent.trim();
        textarea.focus();
      }
    });
  });

  // -----------------------------------------------------------------
  //  AI ASSISTANT CORE
  // -----------------------------------------------------------------
  const submitBtn = document.getElementById("submitQuery");
  const responseBox = document.getElementById("aiResponse");

  function showLoading() {
    responseBox.style.display = "block";
    responseBox.innerHTML =
      '<div class="resp-loading">Analysing your situation…</div>';
  }

  function showError(msg) {
    responseBox.style.display = "block";
    responseBox.innerHTML = '<div class="resp-error">⚠️ ' + msg + "</div>";
  }

  function renderResponse(text) {
    const lines = text.split("\n");
    let html = "",
      inList = false,
      inSection = false;
    const sectionKeys = [
      "SITUATION",
      "YOUR RIGHTS",
      "APPLICABLE LAWS",
      "WHAT TO DO",
      "EVIDENCE TO COLLECT",
      "WHO TO CONTACT",
      "EMERGENCY",
    ];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        continue;
      }
      const hk = sectionKeys.find(
        (k) =>
          line.toUpperCase().startsWith(k + ":") || line.toUpperCase() === k,
      );
      if (hk) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        if (inSection) {
          html += "</div>";
          inSection = false;
        }
        const rest = line.slice(hk.length + 1).trim();
        const cls =
          hk === "EMERGENCY" ? "resp-section resp-emergency" : "resp-section";
        const icon = hk === "EMERGENCY" ? "🚨 " : "";
        html +=
          '<div class="' +
          cls +
          '"><div class="resp-label">' +
          icon +
          hk +
          "</div>";
        if (rest) html += '<p style="margin:2px 0">' + rest + "</p>";
        inSection = true;
      } else if (/^[•\-\d]/.test(line)) {
        if (!inList) {
          html += '<ul class="resp-list">';
          inList = true;
        }
        html +=
          "<li>" +
          line.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "") +
          "</li>";
      } else if (line.startsWith("⚖")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        if (inSection) {
          html += "</div>";
          inSection = false;
        }
        html +=
          '<hr class="resp-divider"><div class="resp-footer">' +
          line +
          "</div>";
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html +=
          '<p style="margin:3px 0;color:rgba(255,255,255,0.82)">' +
          line +
          "</p>";
      }
    }
    if (inList) html += "</ul>";
    if (inSection) html += "</div>";
    responseBox.style.display = "block";
    responseBox.innerHTML = html;
  }

  async function sendQuery(query) {
    if (!query || !query.trim()) {
      showError("Please describe your situation first.");
      return;
    }
    showLoading();
    try {
      const API_BASE =
        (window.POCKET_JUDGE_CONFIG &&
          window.POCKET_JUDGE_CONFIG.API_BASE_URL) ||
        "";
      const res = await fetch(API_BASE + "/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.answer) throw new Error("Empty response");
      renderResponse(data.answer);
    } catch (err) {
      console.error("Pocket Judge error:", err);
      showError(
        "Could not reach the AI. Please check your connection and try again.",
      );
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendQuery(document.getElementById("userQuery").value.trim());
    });
    const qa = document.getElementById("userQuery");
    if (qa)
      qa.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
          sendQuery(qa.value.trim());
      });
  }

  // ---- VOICE SEARCH ----
  const voiceBtn = document.getElementById("voiceBtn");
  const voiceStatus = document.getElementById("voiceStatus");

  if (voiceBtn) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      voiceBtn.style.opacity = "0.4";
      voiceBtn.style.cursor = "not-allowed";
      voiceBtn.title = "Voice search requires Chrome or Edge.";
      voiceBtn.addEventListener("click", () => {
        if (voiceStatus)
          voiceStatus.textContent = "⚠️ Voice search requires Chrome or Edge.";
      });
    } else {
      let recognition = null,
        listening = false;

      voiceBtn.addEventListener("click", () => {
        if (listening) {
          recognition && recognition.stop();
          return;
        }

        recognition = new SR();
        recognition.lang = "en-IN";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
          listening = true;
          voiceBtn.classList.add("listening");
          voiceBtn.textContent = "⏹";
          voiceBtn.title = "Click to stop listening";
          if (voiceStatus) voiceStatus.textContent = "🎤 Listening… speak now";
        };

        recognition.onresult = (event) => {
          const results = Array.from(event.results);
          const transcript = results.map((r) => r[0].transcript).join("");
          const ta = document.getElementById("userQuery");
          if (ta) ta.value = transcript;
          const isFinal = results[results.length - 1].isFinal;
          if (voiceStatus)
            voiceStatus.textContent = isFinal
              ? "✅ Got it! Edit or click Ask."
              : "🎤 Hearing: " + transcript;
        };

        recognition.onerror = (event) => {
          listening = false;
          voiceBtn.classList.remove("listening");
          voiceBtn.textContent = "🎤";
          voiceBtn.title = "Click to speak your situation";
          const msgs = {
            "no-speech": "No speech detected. Try again.",
            "audio-capture": "Microphone not found.",
            "not-allowed":
              "Microphone access denied. Allow it in browser settings.",
            network: "Network error during voice recognition.",
            aborted: "",
          };
          if (voiceStatus)
            voiceStatus.textContent =
              msgs[event.error] !== undefined
                ? msgs[event.error]
                : "Voice error: " + event.error;
        };

        recognition.onend = () => {
          listening = false;
          voiceBtn.classList.remove("listening");
          voiceBtn.textContent = "🎤";
          voiceBtn.title = "Click to speak your situation";
          const q = document.getElementById("userQuery")?.value.trim();
          if (q && voiceStatus?.textContent.startsWith("✅")) sendQuery(q);
        };

        try {
          recognition.start();
        } catch (e) {
          listening = false;
          if (voiceStatus)
            voiceStatus.textContent = "Could not start mic: " + e.message;
        }
      });
    }
  }
}

initAIAssistant();
