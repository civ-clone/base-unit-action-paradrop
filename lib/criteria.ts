import Criterion from '@civ-clone/core-rule/Criterion';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import paradropped from './paradropped';

export interface ParadropDependencies {
  unitImprovementRegistry: UnitImprovementRegistry;
  unitRegistry: UnitRegistry;
}

export interface ParadropOptions {
  // Which units can paradrop (Civ2: those with the paradrop flag).
  canParadrop: (unit: Unit) => boolean;
  // Whether the unit can drop from `from` (Civ2: a city or an airbase).
  canDropFrom: (unit: Unit, from: Tile) => boolean;
  // How far the unit can drop: `to` at most this far from `from` (Civ2: `@COSMIC`'s paradrop range, 10).
  range: number;
  // The distance between two tiles. `from.distanceFrom(to)`, the world's topology, by default.
  distance?: (from: Tile, to: Tile) => number;
  // Whether the unit has used none of its moves this turn. By default, its moves are at least its movement.
  hasFullMoves?: (unit: Unit) => boolean;
}

export const hasFullMoves = (unit: Unit): boolean =>
  unit.moves().value() >= unit.movement().value();

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
export const paradropCriteria = (
  { unitImprovementRegistry, unitRegistry }: ParadropDependencies,
  {
    canParadrop,
    canDropFrom,
    range,
    distance = (from: Tile, to: Tile): number => from.distanceFrom(to),
    hasFullMoves: fullMoves = hasFullMoves,
  }: ParadropOptions
): Criterion[] => [
  new Criterion((unit: Unit): boolean => canParadrop(unit)),
  new Criterion((unit: Unit): boolean => fullMoves(unit)),
  new Criterion(
    (unit: Unit): boolean => !paradropped(unit, unitImprovementRegistry)
  ),
  new Criterion((unit: Unit, to: Tile, from: Tile = unit.tile()): boolean =>
    canDropFrom(unit, from)
  ),
  new Criterion(
    (unit: Unit, to: Tile, from: Tile = unit.tile()): boolean =>
      to !== from && !to.isWater() && distance(from, to) <= range
  ),
  new Criterion((unit: Unit, to: Tile): boolean =>
    unitRegistry
      .getByTile(to)
      .every((tileUnit: Unit): boolean => tileUnit.player() === unit.player())
  ),
];

export default paradropCriteria;
