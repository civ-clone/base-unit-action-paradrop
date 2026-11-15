"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paradropped = void 0;
const Paradropped_1 = require("../UnitImprovements/Paradropped");
/** Whether `unit` has been paradropped this turn. */
const paradropped = (unit, unitImprovementRegistry) => unitImprovementRegistry
    .getByUnit(unit)
    .some((improvement) => improvement instanceof Paradropped_1.default);
exports.paradropped = paradropped;
exports.default = exports.paradropped;
//# sourceMappingURL=paradropped.js.map