## Getting Started

First, install packages:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.

## Usage

The Embed player serves content with the same URL paths as Player. For example, if a track's URL on Player is `https://<player-domain>/track/b1fddd49-a3b3-4cfa-af69-fab60f92724c` then the Embed version will be `https://<embed-domain>/track/b1fddd49-a3b3-4cfa-af69-fab60f92724c`. The same logic applies for artist and album pages.

## Gotchas

In Vercel, the Preview environment will break for any pages that have never been requested in Production. This is because of the way it treats `getStaticPaths` in Preview mode.

## Housekeeping

Run prettier before pushing commits:

```bash
npx prettier --write .
```
