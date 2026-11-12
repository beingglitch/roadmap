# Roadmap

A personal learning tracker with checkboxes. It has six tracks, and every lesson lists a video first, then diagrams and text.

- Priority 1: System Design, AI Engineering, Inference Engineering, Cloud & Deployment, AWS Pricing & FinOps
- Priority 2: Unity VR Game Development

## Run

    npm install
    npm run dev        # http://localhost:3000

## Deploy

    vercel --prod

Progress is stored in the browser (localStorage). Use Export/Import on the home page to move it between devices.

## Add or edit a track

Each track is one file in `lib/courses/`. Lessons are plain strings or `[title, { video, read, q, src }]` for lesson-specific links.
