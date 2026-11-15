import Effect from '@civ-clone/core-rule/Effect';
import Paradropped from '../UnitImprovements/Paradropped';
import Player from '@civ-clone/core-player/Player';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import UnitImprovement from '@civ-clone/core-unit-improvement/UnitImprovement';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';

/**
 * The rules a ruleset with `Paradrop` registers: `<prefix>:paradrop/clear-paradropped`, a `TurnStart` rule that takes
 *  `Paradropped` off every unit of the player whose turn is starting (OpenCiv2 clears the flag at its owner's turn
 *  start, with the moved flag).
 */
export const paradropRules = (
  prefix: string,
  {
    unitImprovementRegistry,
  }: { unitImprovementRegistry: UnitImprovementRegistry }
): TurnStart[] => [
  new TurnStart(
    `${prefix}:paradrop/clear-paradropped`,
    new Effect((player: Player): void =>
      unitImprovementRegistry
        .filter(
          (improvement: UnitImprovement): boolean =>
            improvement instanceof Paradropped &&
            improvement.unit().player() === player
        )
        .forEach((improvement: UnitImprovement): void =>
          unitImprovementRegistry.unregister(improvement)
        )
    )
  ),
];

export default paradropRules;
