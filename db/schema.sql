-- Core product models (e.g., Strat, Tele)
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price_cents INTEGER NOT NULL CHECK (base_price_cents >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Option groups (Body Color, Pickguard, Neck, etc.)
CREATE TABLE IF NOT EXISTS option_groups (
  id UUID PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (model_id, slug)
);

-- Concrete options in each group
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY,
  option_group_id UUID NOT NULL REFERENCES option_groups(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price_delta_cents INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (option_group_id, slug)
);

-- Asset mapping for 2D layer swaps and future 3D IDs
CREATE TABLE IF NOT EXISTS option_assets (
  id UUID PRIMARY KEY,
  option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('layer_2d', 'mesh_3d', 'material_3d')),
  asset_key TEXT NOT NULL,
  layer_order INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (option_id, asset_type, asset_key)
);

-- Compatibility rules stored as JSON logic
CREATE TABLE IF NOT EXISTS compatibility_rules (
  id UUID PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  rule_json JSONB NOT NULL,
  message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Saved user builds
CREATE TABLE IF NOT EXISTS builds (
  id UUID PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE RESTRICT,
  selections JSONB NOT NULL,
  total_price_cents INTEGER NOT NULL CHECK (total_price_cents >= 0),
  share_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_options_group ON options(option_group_id);
CREATE INDEX IF NOT EXISTS idx_rules_model ON compatibility_rules(model_id, priority);
CREATE INDEX IF NOT EXISTS idx_builds_model ON builds(model_id);
