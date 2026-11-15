"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paradropped = void 0;
const UnitImprovement_1 = require("@civ-clone/core-unit-improvement/UnitImprovement");
/**
 * The unit was paradropped this turn: it can't drop again until its player's next turn starts (`paradropRules` clears
 *  it then), and a ruleset may give it more attack for the rest of the turn (Civ2: ×1.5, OpenCiv2
 *  `unit_attack_strength`).
 *
 * Registered only for a unit that has dropped, so other units carry nothing extra. A save names it by class, so the
 *  ruleset registers it in its `AvailableUnitImprovementRegistry`, as it does `Fortified`.
 */
class Paradropped extends UnitImprovement_1.default {
}
exports.Paradropped = Paradropped;
exports.default = Paradropped;
//# sourceMappingURL=Paradropped.js.map