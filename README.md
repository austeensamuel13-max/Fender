# Guitar Configurator Starter Kit

This repository contains a practical starter kit for building a Fender Mod Shop-like guitar configurator.

## Contents

- `db/schema.sql` - PostgreSQL schema for models, options, compatibility rules, builds, and pricing.
- `config/strat.sample.json` - Sample model config with options, asset mapping, defaults, and rule hooks.
- `src/lib/rules-engine.js` - Compatibility validation and option suggestion helpers.
- `src/lib/pricing-engine.js` - Quote calculation helper.
- `src/lib/share-link.js` - URL-safe build encode/decode helpers.
- `src/components/preview-layering.md` - Reference implementation notes for 2D layered rendering.

## Quick start

1. Create a PostgreSQL database and run `db/schema.sql`.
2. Load a model JSON config (starting with `config/strat.sample.json`).
3. Use the `rules-engine` to validate selections before quoting.
4. Use the `pricing-engine` to calculate live and server-verified totals.
5. Persist or encode build selections for sharing.

