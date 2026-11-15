import Paradropped from '../UnitImprovements/Paradropped';
import Unit from '@civ-clone/core-unit/Unit';
import UnitImprovement from '@civ-clone/core-unit-improvement/UnitImprovement';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';

/** Whether `unit` has been paradropped this turn. */
export const paradropped = (
  unit: Unit,
  unitImprovementRegistry: UnitImprovementRegistry
): boolean =>
  unitImprovementRegistry
    .getByUnit(unit)
    .some(
      (improvement: UnitImprovement): boolean =>
        improvement instanceof Paradropped
    );

export default paradropped;
