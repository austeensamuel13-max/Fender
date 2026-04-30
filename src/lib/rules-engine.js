/**
 * Validates selections against JSON rules.
 * Rule format:
 * {
 *   if: { all: [ {group, equals|notEquals}, ... ] },
 *   then: { invalid: true, message: string, suggest: { [group]: option } }
 * }
 */

function evaluatePredicate(selection, predicate) {
  const selected = selection[predicate.group];
  if (Object.prototype.hasOwnProperty.call(predicate, 'equals')) {
    return selected === predicate.equals;
  }
  if (Object.prototype.hasOwnProperty.call(predicate, 'notEquals')) {
    return selected !== predicate.notEquals;
  }
  return false;
}

function evaluateCondition(selection, condition) {
  if (!condition) return false;
  if (Array.isArray(condition.all)) {
    return condition.all.every((p) => evaluatePredicate(selection, p));
  }
  if (Array.isArray(condition.any)) {
    return condition.any.some((p) => evaluatePredicate(selection, p));
  }
  return false;
}

function validateSelection(selection, rules = []) {
  const sorted = [...rules].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  const errors = [];
  const suggestions = {};

  for (const rule of sorted) {
    if (!evaluateCondition(selection, rule.if)) continue;
    if (rule.then?.invalid) {
      errors.push(rule.then.message || `Rule violated: ${rule.name || 'unnamed_rule'}`);
      Object.assign(suggestions, rule.then.suggest || {});
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    suggestions
  };
}

module.exports = {
  validateSelection,
  evaluateCondition
};
