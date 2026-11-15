"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paradropCriteria = exports.hasFullMoves = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const paradropped_1 = require("./paradropped");
const hasFullMoves = (unit) => unit.moves().value() >= unit.movement().value();
exports.hasFullMoves = hasFullMoves;
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
const paradropCriteria = ({ unitImprovementRegistry, unitRegistry }, { canParadrop, canDropFrom, range, distance = (from, to) => from.distanceFrom(to), hasFullMoves: fullMoves = exports.hasFullMoves, }) => [
    new Criterion_1.default((unit) => canParadrop(unit)),
    new Criterion_1.default((unit) => fullMoves(unit)),
    new Criterion_1.default((unit) => !(0, paradropped_1.default)(unit, unitImprovementRegistry)),
    new Criterion_1.default((unit, to, from = unit.tile()) => canDropFrom(unit, from)),
    new Criterion_1.default((unit, to, from = unit.tile()) => to !== from && !to.isWater() && distance(from, to) <= range),
    new Criterion_1.default((unit, to) => unitRegistry
        .getByTile(to)
        .every((tileUnit) => tileUnit.player() === unit.player())),
];
exports.paradropCriteria = paradropCriteria;
exports.default = exports.paradropCriteria;
//# sourceMappingURL=criteria.js.map