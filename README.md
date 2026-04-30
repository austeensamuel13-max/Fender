# Guitar Configurator Starter Kit

This repository now includes a working browser-accessible prototype for a Fender Mod Shop-like guitar configurator.

## Contents

- `web/` - Website UI prototype (live customization + SVG guitar preview + validation + price updates).
- `db/schema.sql` - PostgreSQL schema for models, options, compatibility rules, builds, and pricing.
- `config/strat.sample.json` - Sample model config with options, asset mapping, defaults, and rule hooks.
- `src/lib/rules-engine.js` - Compatibility validation and option suggestion helpers.
- `src/lib/pricing-engine.js` - Quote calculation helper.
- `src/lib/share-link.js` - URL-safe build encode/decode helpers.

## Run website locally

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173/web/`

## What the website demonstrates

- Dynamic option controls generated from config.
- Live preview updates as users customize options.
- Compatibility rule validation.
- Auto-fix of invalid option combinations.
- Real-time total pricing.

## Back-end integration path

1. Create a PostgreSQL database and run `db/schema.sql`.
2. Load a model JSON config (starting with `config/strat.sample.json`).
3. Use `src/lib/rules-engine.js` to validate selections server-side.
4. Use `src/lib/pricing-engine.js` for quote calculation.
5. Persist or encode build selections for sharing.
