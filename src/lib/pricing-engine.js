/**
 * Calculate total price from base model + option deltas.
 */
function calculateQuote(config, selection) {
  const lineItems = [];
  let total = config.model.basePriceCents;

  lineItems.push({
    label: config.model.name,
    amountCents: config.model.basePriceCents
  });

  for (const group of config.groups) {
    const selectedSlug = selection[group.slug];
    const option = group.options.find((o) => o.slug === selectedSlug);

    if (!option) {
      throw new Error(`Missing option for group ${group.slug}`);
    }

    total += option.priceDeltaCents;
    lineItems.push({
      label: `${group.name}: ${option.name}`,
      amountCents: option.priceDeltaCents
    });
  }

  return { totalCents: total, lineItems };
}

module.exports = { calculateQuote };
