# base-unit-action-paradrop

The `Paradrop` unit action: a unit drops onto a land tile within a range, as OpenCiv2's `unit_paradrop` does.

- `Paradrop`: `new Paradrop(from, to, unit, ruleRegistry?, cityRegistry?, unitImprovementRegistry?)`. `perform()` puts
  the unit on `to`, marks it `Paradropped`, runs the `Moved` rules with the action, and, on a city of another player,
  clears the unit's damage and captures the city with `City.capture`, as `CaptureCity` does. It uses no moves: it isn't
  a `Move`, so no `ValidateMove` rule charges for it.
- `UnitImprovements/Paradropped`: the mark, a `UnitImprovement` registered only on a unit that has dropped. It stops a
  second drop in the same turn, and a ruleset can read it for an attack bonus (Civ2: ×1.5).
- `lib/criteria`: `paradropCriteria({ unitImprovementRegistry, unitRegistry }, options)`, in order: `canParadrop(unit)`;
  `hasFullMoves(unit)` (no moves used: moves at least movement, by default) and not `Paradropped`;
  `canDropFrom(unit, from)` (Civ2: a city or an airbase); `to` isn't `from`, isn't water, and is no more than `range`
  away by `distance(from, to)` (`from.distanceFrom(to)` by default); no unit of another player on `to`. A drop into
  the city of a player at peace is the ruleset's to refuse, with its own peace criteria after these.
- `lib/paradropRules`: `paradropRules(prefix, { unitImprovementRegistry })` gives
  `<prefix>:paradrop/clear-paradropped`, a `TurnStart` rule that takes `Paradropped` off the units of the player
  whose turn is starting.
- `lib/paradropped`: `paradropped(unit, unitImprovementRegistry)`, whether the unit has dropped this turn.

**State.** The mark is a `UnitImprovement` rather than a field on the unit, so a unit that never drops carries nothing
extra, and it is saved like `Fortified`: a ruleset using it registers `Paradropped` in its
`AvailableUnitImprovementRegistry` so a save can name it.

A library: it has no `main` and registers no rules.
