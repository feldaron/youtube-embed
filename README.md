# YouTube Embed

A tiny, dependency-free Cloudflare Worker that turns a pasted YouTube link into a responsive embedded player.

## Features

- Loads a video immediately when a valid link is pasted
- Supports `youtube.com/watch`, `youtu.be`, Shorts, Live and embed links
- Uses YouTube's privacy-enhanced `youtube-nocookie.com` player
- Responsive layout for desktop and mobile
- Accepts a video through the shareable `?v=VIDEO_ID` URL parameter
- Includes a restrictive Content Security Policy and other browser security headers

## Run locally

```sh
npx wrangler dev
```

## Deploy

Sign in to Cloudflare, then run:

```sh
npx wrangler deploy
```

You can also connect this repository to Cloudflare Workers Builds and use `npx wrangler deploy` as the deploy command.

## Structure

- `worker/index.js` — Worker and complete embedded webpage
- `wrangler.jsonc` — Cloudflare Worker configuration

No API keys, environment variables, storage, or build step are required.
