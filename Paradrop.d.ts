import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Action from '@civ-clone/core-unit/Action';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * Drops the unit onto `to`, as OpenCiv2's `unit_paradrop` does. It uses no moves: the unit lands with the moves it had,
 *  marked `Paradropped` so it can't drop again this turn.
 *
 * In order:
 * 1. the unit is put on `to` and marked `Paradropped`;
 * 2. the `Moved` rules run for it, with this action, as after any move (the client's redraw, the unit's visibility);
 * 3. on a city of another player (the criteria allow it only when no foreign unit is there), the unit's damage is
 *    cleared and the city is captured by its player, through `City.capture`, as `CaptureCity` does.
 *
 * Moves aren't taken through `ValidateMove`, as a `Move` would, which is why this isn't one: a ruleset's
 *  `ValidateMove` rules charge a move's cost.
 */
export declare class Paradrop extends Action {
  private _cityRegistry;
  private _unitImprovementRegistry;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry?: RuleRegistry,
    cityRegistry?: CityRegistry,
    unitImprovementRegistry?: UnitImprovementRegistry
  );
  perform(): void;
}
export default Paradrop;
