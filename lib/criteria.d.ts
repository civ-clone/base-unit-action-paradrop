import Criterion from '@civ-clone/core-rule/Criterion';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
export interface ParadropDependencies {
  unitImprovementRegistry: UnitImprovementRegistry;
  unitRegistry: UnitRegistry;
}
export interface ParadropOptions {
  canParadrop: (unit: Unit) => boolean;
  canDropFrom: (unit: Unit, from: Tile) => boolean;
  range: number;
  distance?: (from: Tile, to: Tile) => number;
  hasFullMoves?: (unit: Unit) => boolean;
}
export declare const hasFullMoves: (unit: Unit) => boolean;
/**
 * The criteria for paradropping onto `to`, in order, as OpenCiv2's `unit_cmd_paradrop` and `unit_paradrop` check them:
 * - `canParadrop(unit)`;
 * - the unit has used none of its moves (`hasFullMoves`) and hasn't been `Paradropped` this turn;
 * - `canDropFrom(unit, from)`;
 * - `to` isn't `from`, isn't water, and is within `range` (`distance(from, to) <= range`);
 * - no unit of another player is on `to` (an empty city of another player can be dropped into, and is captured).
 *
 * A drop into a city of a player at peace is the ruleset's to refuse or confirm, with its own peace criteria after
 *  these.
 */
export declare const paradropCriteria: (
  { unitImprovementRegistry, unitRegistry }: ParadropDependencies,
  {
    canParadrop,
    canDropFrom,
    range,
    distance,
    hasFullMoves: fullMoves,
  }: ParadropOptions
) => Criterion[];
export default paradropCriteria;
