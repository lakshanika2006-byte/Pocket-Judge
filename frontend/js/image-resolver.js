// ===================================================================
//  IMAGE RESOLVER — The Pocket Judge
// ===================================================================
//  v2 — REWRITTEN TO BE QUIET.
//
//  The previous version of this file tried to compensate for not
//  having a real file listing by guessing: it generated extension
//  variants (.webp/.jpg/.png), case variants, and numbered-sibling
//  guesses (item-2.webp, item_2.jpg, item2.png...) and fired a real
//  network request for every guess. That produced hundreds of
//  legitimate 404s per page load — which buried the handful of REAL
//  broken paths under a wall of noise, and made the browser issue
//  dozens of wasted requests before anything rendered.
//
//  This version does the opposite: ONE request per image slot.
//  - If the path in leaders-data.js / index.html is correct, it loads
//    immediately, exactly like a plain <img>, with no extra requests.
//  - If it's wrong, you get exactly ONE 404 for that slot, a single
//    console.warn with the exact path that failed, and a clean
//    placeholder — instead of a flood of guesses.
//
//  This trades "maybe auto-recovers from a typo" for "tells you
//  clearly and immediately what's actually broken." Given that the
//  previous approach's guessing didn't fix the underlying paths
//  anyway (it just hid the signal), this is the more useful trade.
// ===================================================================

window.ImageResolver = (function () {
  const FALLBACK_PORTRAIT = "assets/images/fallback/portrait-fallback.jpg";
  const FALLBACK_ARTIFACT = "assets/images/fallback/artifact-fallback.jpg";

  // Tracks which exact paths have already failed, so the same broken
  // path only ever gets logged once even if referenced in multiple
  // places (e.g. the same portrait used in the loader AND the
  // gallery pedestal).
  const knownBad = new Set();
  const knownGood = new Set();

  // ---- Single real load test, no variants, no guessing. ----
  function probe(url) {
    return new Promise((resolve) => {
      if (knownBad.has(url)) return resolve(false);
      if (knownGood.has(url)) return resolve(true);

      const img = new Image();
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        if (ok) knownGood.add(url);
        else knownBad.add(url);
        resolve(ok);
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = url;
      if (img.complete && img.naturalWidth > 0) done(true);
    });
  }

  // ---- Public: resolve exactly one path. No retries, no variants. ----
  // Logs once, clearly, on failure — so the console shows you exactly
  // what's broken instead of a wall of speculative misses.
  async function resolveImage(path) {
    if (!path) return null;
    const ok = await probe(path);
    if (!ok) {
      console.warn(`[ImageResolver] Missing or unreachable: "${path}"`);
      return null;
    }
    return path;
  }

  // ---- Public: build a gallery from an EXPLICIT list of paths. ----
  // This replaces the old sibling-guessing entirely. If you want an
  // artifact to show multiple images, list them explicitly in
  // leaders-data.js (see the `images: [...]` array support added to
  // main.js) rather than relying on the resolver to guess filenames
  // that may or may not exist. Each listed path is verified with one
  // request; only the ones that actually load make it into the
  // returned array, in the order given.
  async function resolveGalleryFromList(paths) {
    const list = (paths || []).filter(Boolean);
    if (!list.length) return [];
    const results = await Promise.all(
      list.map(async (p) => ((await probe(p)) ? p : null)),
    );
    return results.filter(Boolean);
  }

  // ---- Public: wire a single <img> element through the resolver ----
  function applyResolvedImage(imgEl, candidatePath, options = {}) {
    const { kind = "artifact", alt = "" } = options;
    const fallback =
      kind === "portrait" ? FALLBACK_PORTRAIT : FALLBACK_ARTIFACT;

    imgEl.classList.add("img-resolving");
    imgEl.alt = alt;

    resolveImage(candidatePath).then((resolved) => {
      const finalSrc = resolved || fallback;
      const markMissing = !resolved;

      const settle = () => {
        imgEl.classList.remove("img-resolving");
        imgEl.classList.add("img-loaded");
        if (markMissing) {
          imgEl.classList.add("img-fallback");
          const card = imgEl.closest(
            ".artifact-card, .lframe, .exhibit-pedestal, .timeline-event",
          );
          if (card) card.classList.add("media-missing");
        }
      };

      imgEl.src = finalSrc;
      if (imgEl.complete) {
        settle();
      } else {
        imgEl.addEventListener("load", settle, { once: true });
        imgEl.addEventListener("error", settle, { once: true });
      }
    });
  }

  // ---- Public: one-time startup audit. ----
  // Walks window.LEADERS_DATA and checks every referenced path
  // EXACTLY ONCE each, then prints a single clean summary table to
  // the console — e.g. "12 of 47 image paths in leaders-data.js are
  // missing" with the full list. This is the fastest way to see the
  // real, complete picture of what's broken without digging through
  // the Network tab one request at a time.
  async function auditLeaderData() {
    const data = window.LEADERS_DATA;
    if (!data) {
      console.warn(
        "[ImageResolver] window.LEADERS_DATA not found — skipping audit.",
      );
      return;
    }

    const checks = []; // { leader, field, path }
    Object.entries(data).forEach(([key, leader]) => {
      if (leader.portrait)
        checks.push({ leader: key, field: "portrait", path: leader.portrait });
      (leader.artifacts || []).forEach((a) => {
        if (a.image)
          checks.push({
            leader: key,
            field: `artifact:${a.id}`,
            path: a.image,
          });
        (a.images || []).forEach((img, i) =>
          checks.push({
            leader: key,
            field: `artifact:${a.id}:images[${i}]`,
            path: img,
          }),
        );
      });
      (leader.timeline || []).forEach((ev, i) => {
        if (ev.image)
          checks.push({ leader: key, field: `timeline[${i}]`, path: ev.image });
      });
    });

    const results = await Promise.all(
      checks.map(async (c) => ({ ...c, ok: await probe(c.path) })),
    );

    const missing = results.filter((r) => !r.ok);
    const total = results.length;

    if (missing.length === 0) {
      console.log(
        `[ImageResolver] Audit complete: all ${total} image paths in leaders-data.js loaded successfully.`,
      );
    } else {
      console.warn(
        `[ImageResolver] Audit complete: ${missing.length} of ${total} image paths in leaders-data.js FAILED to load:`,
      );
      console.table(
        missing.map((r) => ({
          leader: r.leader,
          field: r.field,
          path: r.path,
        })),
      );
    }
    return { total, missingCount: missing.length, missing };
  }

  return {
    resolveImage,
    resolveGalleryFromList,
    applyResolvedImage,
    auditLeaderData,
    FALLBACK_PORTRAIT,
    FALLBACK_ARTIFACT,
  };
})();
