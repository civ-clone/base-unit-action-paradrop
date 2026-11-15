import Unit from '@civ-clone/core-unit/Unit';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
/** Whether `unit` has been paradropped this turn. */
export declare const paradropped: (
  unit: Unit,
  unitImprovementRegistry: UnitImprovementRegistry
) => boolean;
export default paradropped;
