import config from '../config/strat.sample.json' assert { type: 'json' };

const selection = Object.fromEntries(config.groups.map((g) => [g.slug, g.defaultOption]));

const colorMap = {
  olympic_white: '#f3f3f3',
  three_tone_sunburst: '#8b2f24',
  mint_green_sss: '#dce0d6',
  parchment_hss: '#f0e4c6'
};

function evaluatePredicate(sel, predicate) {
  const selected = sel[predicate.group];
  if ('equals' in predicate) return selected === predicate.equals;
  if ('notEquals' in predicate) return selected !== predicate.notEquals;
  return false;
}

function validateSelection(sel, rules = []) {
  const sorted = [...rules].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  const errors = [];
  const suggestions = {};

  for (const rule of sorted) {
    const ok = Array.isArray(rule.if?.all) && rule.if.all.every((p) => evaluatePredicate(sel, p));
    if (!ok) continue;
    if (rule.then?.invalid) {
      errors.push(rule.then.message || `Rule violated: ${rule.name}`);
      Object.assign(suggestions, rule.then.suggest || {});
    }
  }

  return { valid: errors.length === 0, errors, suggestions };
}

function calculateQuote(cfg, sel) {
  let total = cfg.model.basePriceCents;
  for (const group of cfg.groups) {
    const option = group.options.find((o) => o.slug === sel[group.slug]);
    total += option?.priceDeltaCents || 0;
  }
  return total;
}

function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

function applyPreview() {
  document.getElementById('body').setAttribute('fill', colorMap[selection.body_color] || '#f3f3f3');
  document.getElementById('pickguard').setAttribute('fill', colorMap[selection.pickguard] || '#dce0d6');

  const sss = document.getElementById('pickup-sss');
  const hss = document.getElementById('pickup-hss');
  const isHss = selection.pickup_config === 'hss';
  sss.classList.toggle('hidden', isHss);
  hss.classList.toggle('hidden', !isHss);
}

function renderControls() {
  const controls = document.getElementById('controls');
  controls.innerHTML = `<h2>Customize</h2>`;

  for (const group of config.groups) {
    const wrapper = document.createElement('div');
    wrapper.className = 'group';

    const label = document.createElement('label');
    label.textContent = group.name;

    const select = document.createElement('select');
    for (const option of group.options) {
      const el = document.createElement('option');
      el.value = option.slug;
      el.textContent = `${option.name}${option.priceDeltaCents ? ` (+${money(option.priceDeltaCents)})` : ''}`;
      if (selection[group.slug] === option.slug) el.selected = true;
      select.appendChild(el);
    }

    select.addEventListener('change', () => {
      selection[group.slug] = select.value;
      update();
    });

    wrapper.append(label, select);
    controls.appendChild(wrapper);
  }

  const fixBtn = document.createElement('button');
  fixBtn.textContent = 'Auto-fix invalid combo';
  fixBtn.addEventListener('click', () => {
    const result = validateSelection(selection, config.rules);
    Object.assign(selection, result.suggestions);
    update(true);
  });

  controls.appendChild(fixBtn);
}

function update(fromAutofix = false) {
  applyPreview();

  const result = validateSelection(selection, config.rules);
  const validation = document.getElementById('validation');
  if (result.valid) {
    validation.className = 'validation ok';
    validation.textContent = fromAutofix ? 'Selections auto-corrected and valid.' : 'Valid configuration.';
  } else {
    validation.className = 'validation';
    validation.textContent = result.errors[0];
  }

  document.getElementById('total-price').textContent = money(calculateQuote(config, selection));

  for (const group of config.groups) {
    const select = [...document.querySelectorAll('select')].find((s, idx) => config.groups[idx].slug === group.slug);
    if (select) select.value = selection[group.slug];
  }
}

renderControls();
update();
