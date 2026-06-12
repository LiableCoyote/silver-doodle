/**
 * Static validator for the event deck (npm run validate:content).
 * Errors exit nonzero; warnings print but pass. Checks:
 *  - unique card and choice ids; positive weights; >= 2 choices per card
 *  - every prose list and outcome list has a default (unconditional) variant
 *  - unreachable prose variants (variant range contradicts the card trigger)
 *  - flags read in triggers/requires but set nowhere (error; 'crackdown' is
 *    engine-set and whitelisted), and flags set but never read (warning)
 *  - crackdown cards: exactly one martyrConversion choice, and repeatable
 */
import type { Condition, Range } from '../src/engine/events';
import { ART_KEYS } from '../src/content/art';
import { DECK, EPILOGUE_FLAGS } from '../src/content/events';
import { ENGINE_READ_FLAGS } from '../src/engine/loyalty';
import { CRACKDOWN_FLAG } from '../src/engine/reducer';

const errors: string[] = [];
const warnings: string[] = [];

function rangesContradict(a: Range | undefined, b: Range | undefined): boolean {
  if (!a || !b) return false;
  if (a.gte !== undefined && b.lte !== undefined && a.gte > b.lte) return true;
  if (a.lte !== undefined && b.gte !== undefined && b.gte > a.lte) return true;
  return false;
}

/** True when a variant's condition can never hold given the card trigger. */
function unreachable(variantWhen: Condition, trigger: Condition): boolean {
  for (const [key, range] of Object.entries(variantWhen.resource ?? {})) {
    if (rangesContradict(range, trigger.resource?.[key as keyof typeof trigger.resource])) {
      return true;
    }
  }
  if (rangesContradict(variantWhen.turn, trigger.turn)) return true;
  if (rangesContradict(variantWhen.cohesion, trigger.cohesion)) return true;
  if (variantWhen.flags?.some((f) => trigger.notFlags?.includes(f))) return true;
  if (variantWhen.notFlags?.some((f) => trigger.flags?.includes(f))) return true;
  return false;
}

const ids = new Set<string>();
// The engine sets 'crackdown' and 'unit-refused' itself.
const flagsSet = new Set<string>([CRACKDOWN_FLAG, 'unit-refused']);
// Flags consumed by the loyalty engine or reserved for the epilogue.
const flagsRead = new Set<string>([...ENGINE_READ_FLAGS, ...EPILOGUE_FLAGS]);

for (const card of DECK) {
  if (ids.has(card.id)) errors.push(`${card.id}: duplicate card id`);
  ids.add(card.id);

  if (card.weight <= 0) errors.push(`${card.id}: weight must be positive`);
  if (card.choices.length < 2) errors.push(`${card.id}: needs at least 2 choices`);
  if (!card.prose.some((v) => !v.when)) errors.push(`${card.id}: prose has no default variant`);

  for (const v of card.prose) {
    if (v.when && unreachable(v.when, card.trigger)) {
      errors.push(`${card.id}: prose variant contradicts the card trigger`);
    }
  }

  card.trigger.flags?.forEach((f) => flagsRead.add(f));
  card.trigger.notFlags?.forEach((f) => flagsRead.add(f));

  const choiceIds = new Set<string>();
  for (const choice of card.choices) {
    if (choiceIds.has(choice.id)) errors.push(`${card.id}/${choice.id}: duplicate choice id`);
    choiceIds.add(choice.id);
    if (!choice.outcome.some((v) => !v.when)) {
      errors.push(`${card.id}/${choice.id}: outcome has no default variant`);
    }
    for (const v of choice.outcome) {
      if (v.when && unreachable(v.when, card.trigger)) {
        errors.push(`${card.id}/${choice.id}: outcome variant contradicts the card trigger`);
      }
    }
    choice.requires?.flags?.forEach((f) => flagsRead.add(f));
    choice.requires?.notFlags?.forEach((f) => flagsRead.add(f));
    choice.effect.setFlags?.forEach((f) => flagsSet.add(f));
    choice.effect.clearFlags?.forEach((f) => flagsRead.add(f));
  }

  const isCrackdown = card.trigger.flags?.includes(CRACKDOWN_FLAG);
  if (isCrackdown) {
    const dialChoices = card.choices.filter((c) => c.effect.martyrConversion);
    if (dialChoices.length !== 1) {
      errors.push(`${card.id}: crackdown card must have exactly one martyrConversion choice`);
    }
    if (card.once !== false) {
      errors.push(`${card.id}: crackdown cards must be repeatable (once: false)`);
    }
  }
}

// Art coverage: every card art key must have a drawn scene; unused scenes warn.
const usedArt = new Set(DECK.flatMap((c) => (c.art ? [c.art] : [])));
for (const key of usedArt) {
  if (!ART_KEYS.includes(key)) errors.push(`art key "${key}" has no scene in src/content/art.tsx`);
}
for (const key of ART_KEYS) {
  if (!usedArt.has(key)) warnings.push(`art scene "${key}" is drawn but used by no card`);
}

for (const flag of flagsRead) {
  if (!flagsSet.has(flag)) errors.push(`flag "${flag}" is read but never set by any choice`);
}
for (const flag of flagsSet) {
  if (flag !== CRACKDOWN_FLAG && !flagsRead.has(flag)) {
    warnings.push(`flag "${flag}" is set but never read`);
  }
}

const variants = DECK.reduce(
  (n, c) => n + c.prose.filter((v) => v.when).length + c.choices.reduce((m, ch) => m + ch.outcome.filter((v) => v.when).length, 0),
  0,
);
console.log(`Deck: ${DECK.length} cards, ${DECK.reduce((n, c) => n + c.choices.length, 0)} choices, ${variants} conditional prose variants.`);

for (const w of warnings) console.warn(`warn: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log('Content validation passed.');
