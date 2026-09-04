const page = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b0b0d">
    <meta name="description" content="Paste a YouTube link and watch it in a clean, distraction-free player.">
    <title>YouTube Embed</title>
    <style>
      :root {
        color-scheme: dark;
        --background: #09090b;
        --panel: rgba(24, 24, 27, 0.82);
        --panel-solid: #18181b;
        --line: rgba(255, 255, 255, 0.12);
        --text: #fafafa;
        --muted: #a1a1aa;
        --accent: #ff2d2d;
        --accent-hover: #ff4545;
        --danger: #ff8f8f;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      * { box-sizing: border-box; }

      body {
        min-width: 320px;
        min-height: 100vh;
        margin: 0;
        color: var(--text);
        background:
          radial-gradient(circle at 50% -10%, rgba(255, 45, 45, 0.18), transparent 34rem),
          linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px),
          var(--background);
        background-size: auto, 48px 48px, 48px 48px, auto;
      }

      .shell {
        width: min(100% - 2rem, 72rem);
        margin: 0 auto;
        padding: clamp(2rem, 6vw, 5rem) 0 3rem;
      }

      header {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 2.25rem;
      }

      .brand-mark {
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        place-items: center;
        border-radius: 0.85rem;
        background: var(--accent);
        box-shadow: 0 0 2.5rem rgba(255, 45, 45, 0.3);
      }

      .brand-mark svg { width: 1.35rem; margin-left: 0.15rem; }

      h1 {
        margin: 0;
        font-size: clamp(1.55rem, 4vw, 2.15rem);
        letter-spacing: -0.04em;
      }

      .eyebrow {
        margin: 0 0 0.25rem;
        color: var(--muted);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      form {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.7rem;
        padding: 0.65rem;
        border: 1px solid var(--line);
        border-radius: 1.1rem;
        background: var(--panel);
        box-shadow: 0 1.5rem 5rem rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(16px);
      }

      label {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      input {
        width: 100%;
        min-width: 0;
        padding: 0.9rem 1rem;
        border: 0;
        border-radius: 0.7rem;
        outline: 0;
        color: var(--text);
        background: transparent;
        font: inherit;
        font-size: 1rem;
      }

      input::placeholder { color: #71717a; }
      input:focus-visible { box-shadow: inset 0 0 0 2px rgba(255, 45, 45, 0.72); }

      button, .youtube-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-height: 3rem;
        padding: 0.75rem 1.15rem;
        border: 0;
        border-radius: 0.7rem;
        color: white;
        background: var(--accent);
        font: inherit;
        font-weight: 750;
        text-decoration: none;
        cursor: pointer;
        transition: transform 160ms ease, background 160ms ease;
      }

      button:hover, .youtube-link:hover { background: var(--accent-hover); transform: translateY(-1px); }
      button:active, .youtube-link:active { transform: translateY(0); }
      button:focus-visible, .youtube-link:focus-visible { outline: 3px solid white; outline-offset: 3px; }

      .helper {
        min-height: 1.5rem;
        margin: 0.75rem 0 1rem;
        padding-left: 0.2rem;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .helper.error { color: var(--danger); }

      .stage {
        position: relative;
        display: grid;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        place-items: center;
        border: 1px solid var(--line);
        border-radius: clamp(1rem, 2vw, 1.4rem);
        background: #050505;
        box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.38);
      }

      .stage::before {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0.055), transparent 55%);
        content: "";
        pointer-events: none;
      }

      .empty {
        position: relative;
        display: grid;
        max-width: 26rem;
        gap: 1rem;
        justify-items: center;
        padding: 2rem;
        color: var(--muted);
        text-align: center;
      }

      .empty-icon {
        display: grid;
        width: 4.5rem;
        height: 4.5rem;
        place-items: center;
        border: 1px solid var(--line);
        border-radius: 50%;
        background: var(--panel-solid);
      }

      .empty-icon svg { width: 1.4rem; margin-left: 0.2rem; color: var(--accent); }
      .empty p { margin: 0; line-height: 1.55; }

      iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        min-height: 3.75rem;
        padding-top: 0.75rem;
      }

      .youtube-link {
        min-height: 2.75rem;
        padding: 0.65rem 0.95rem;
        border: 1px solid var(--line);
        color: var(--text);
        background: var(--panel-solid);
        font-size: 0.9rem;
      }

      .youtube-link:hover { background: #27272a; }
      [hidden] { display: none !important; }

      @media (max-width: 640px) {
        .shell { width: min(100% - 1.25rem, 72rem); padding-top: 1.5rem; }
        header { margin-bottom: 1.5rem; }
        form { grid-template-columns: 1fr; }
        button { width: 100%; }
        .stage { border-radius: 0.9rem; }
        .empty { font-size: 0.9rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header>
        <div class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12 8 5.14Z"/></svg>
        </div>
        <div>
          <p class="eyebrow">Clean player</p>
          <h1>YouTube Embed</h1>
        </div>
      </header>

      <form id="video-form" novalidate>
        <label for="youtube-url">YouTube link</label>
        <input id="youtube-url" name="url" type="text" inputmode="url" autocomplete="url" spellcheck="false" placeholder="Paste a YouTube link here…" autofocus>
        <button type="submit">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14Z"/></svg>
          Load video
        </button>
      </form>
      <p id="message" class="helper" role="status" aria-live="polite">Standard, Shorts, Live and youtu.be links are supported.</p>

      <section class="stage" id="stage" aria-label="Video player">
        <div class="empty" id="empty-state">
          <div class="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72L19 12 8 5.14Z"/></svg>
          </div>
          <p>Your video will appear here as soon as you paste a valid YouTube link.</p>
        </div>
      </section>
      <div class="actions">
        <a class="youtube-link" id="youtube-link" href="#" target="_blank" rel="noopener noreferrer" hidden>Open on YouTube ↗</a>
      </div>
    </main>

    <script>
      const form = document.querySelector("#video-form");
      const input = document.querySelector("#youtube-url");
      const stage = document.querySelector("#stage");
      const emptyState = document.querySelector("#empty-state");
      const message = document.querySelector("#message");
      const youtubeLink = document.querySelector("#youtube-link");

      function extractVideoId(value) {
        const candidate = value.trim();
        if (/^[A-Za-z0-9_-]{11}$/.test(candidate)) return candidate;

        let parsed;
        try {
          parsed = new URL(candidate.match(/^https?:\/\//i) ? candidate : "https://" + candidate);
        } catch {
          return null;
        }

        const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
        let id = null;

        if (host === "youtu.be") {
          id = parsed.pathname.split("/").filter(Boolean)[0];
        } else if (["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com"].includes(host)) {
          if (parsed.pathname === "/watch") id = parsed.searchParams.get("v");
          if (!id) {
            const parts = parsed.pathname.split("/").filter(Boolean);
            if (["shorts", "embed", "live"].includes(parts[0])) id = parts[1];
          }
        }

        return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      }

      function loadVideo(rawValue) {
        const id = extractVideoId(rawValue);
        if (!id) {
          message.textContent = "That doesn’t look like a valid YouTube link. Check it and try again.";
          message.classList.add("error");
          input.setAttribute("aria-invalid", "true");
          input.focus();
          return false;
        }

        const oldFrame = stage.querySelector("iframe");
        if (oldFrame) oldFrame.remove();

        const frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
        frame.title = "YouTube video player";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allowFullscreen = true;
        stage.appendChild(frame);

        emptyState.hidden = true;
        youtubeLink.href = "https://www.youtube.com/watch?v=" + id;
        youtubeLink.hidden = false;
        message.textContent = "Video ready.";
        message.classList.remove("error");
        input.removeAttribute("aria-invalid");

        const pageUrl = new URL(window.location.href);
        pageUrl.search = "";
        pageUrl.searchParams.set("v", id);
        history.replaceState(null, "", pageUrl);
        return true;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        loadVideo(input.value);
      });

      input.addEventListener("paste", () => {
        window.setTimeout(() => {
          if (extractVideoId(input.value)) loadVideo(input.value);
        }, 0);
      });

      const initialVideo = new URL(window.location.href).searchParams.get("v");
      if (initialVideo && extractVideoId(initialVideo)) {
        input.value = initialVideo;
        loadVideo(initialVideo);
      }
    </script>
  </body>
</html>`;

const securityHeaders = {
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-src https://www.youtube-nocookie.com; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "content-type": "text/html; charset=utf-8",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    if (url.pathname !== "/") {
      return new Response("Not found", { status: 404 });
    }

    return new Response(request.method === "HEAD" ? null : page, {
      headers: {
        ...securityHeaders,
        "cache-control": "public, max-age=300",
      },
    });
  },
};
