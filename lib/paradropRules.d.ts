import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
/**
 * The rules a ruleset with `Paradrop` registers: `<prefix>:paradrop/clear-paradropped`, a `TurnStart` rule that takes
 *  `Paradropped` off every unit of the player whose turn is starting (OpenCiv2 clears the flag at its owner's turn
 *  start, with the moved flag).
 */
export declare const paradropRules: (
  prefix: string,
  {
    unitImprovementRegistry,
  }: {
    unitImprovementRegistry: UnitImprovementRegistry;
  }
) => TurnStart[];
export default paradropRules;
