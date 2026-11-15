"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paradropRules = void 0;
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Paradropped_1 = require("../UnitImprovements/Paradropped");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
/**
 * The rules a ruleset with `Paradrop` registers: `<prefix>:paradrop/clear-paradropped`, a `TurnStart` rule that takes
 *  `Paradropped` off every unit of the player whose turn is starting (OpenCiv2 clears the flag at its owner's turn
 *  start, with the moved flag).
 */
const paradropRules = (prefix, { unitImprovementRegistry, }) => [
    new TurnStart_1.default(`${prefix}:paradrop/clear-paradropped`, new Effect_1.default((player) => unitImprovementRegistry
        .filter((improvement) => improvement instanceof Paradropped_1.default &&
        improvement.unit().player() === player)
        .forEach((improvement) => unitImprovementRegistry.unregister(improvement)))),
];
exports.paradropRules = paradropRules;
exports.default = exports.paradropRules;
//# sourceMappingURL=paradropRules.js.map