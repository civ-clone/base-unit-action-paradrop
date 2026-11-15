import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Action from '@civ-clone/core-unit/Action';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Paradropped from './UnitImprovements/Paradropped';
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
export class Paradrop extends Action {
  private _cityRegistry: CityRegistry;
  private _unitImprovementRegistry: UnitImprovementRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    cityRegistry: CityRegistry = cityRegistryInstance,
    unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry);

    this._cityRegistry = cityRegistry;
    this._unitImprovementRegistry = unitImprovementRegistry;
  }

  perform(): void {
    const unit = this.unit(),
      city = this._cityRegistry.getByTile(this.to());

    unit.setTile(this.to());

    this._unitImprovementRegistry.register(new Paradropped(unit));

    this.ruleRegistry().process(Moved, unit, this);

    if (city === null || city.player() === unit.player()) {
      return;
    }

    // `unit_paradrop` clears the dropping unit's damage before the capture.
    unit.setDamage(0);

    city.capture(unit.player());
  }
}

export default Paradrop;
