"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paradrop = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const Action_1 = require("@civ-clone/core-unit/Action");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const Paradropped_1 = require("./UnitImprovements/Paradropped");
/**
 * Drops the unit onto `to`, as OpenCiv2's `unit_paradrop` does. It uses no moves: the unit lands with the moves it had,
 *  marked `Paradropped` so it can't drop again this turn.
 *
 * In order:
 * 1. the unit is put on `to` and marked `Paradropped`;
 * 2. the `Moved` rules run for it, with this action, as after any move (the client's redraw, the unit's visibility);
 * 3. on a city of another player (the criteria allow it only when no foreign unit is there), the unit's damage is
 *    cleared and the city is captured by its player, through `City.capture`, as `CaptureCity` does.
 *
 * Moves aren't taken through `ValidateMove`, as a `Move` would, which is why this isn't one: a ruleset's
 *  `ValidateMove` rules charge a move's cost.
 */
class Paradrop extends Action_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, cityRegistry = CityRegistry_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) {
        super(from, to, unit, ruleRegistry);
        this._cityRegistry = cityRegistry;
        this._unitImprovementRegistry = unitImprovementRegistry;
    }
    perform() {
        const unit = this.unit(), city = this._cityRegistry.getByTile(this.to());
        unit.setTile(this.to());
        this._unitImprovementRegistry.register(new Paradropped_1.default(unit));
        this.ruleRegistry().process(Moved_1.default, unit, this);
        if (city === null || city.player() === unit.player()) {
            return;
        }
        // `unit_paradrop` clears the dropping unit's damage before the capture.
        unit.setDamage(0);
        city.capture(unit.player());
    }
}
exports.Paradrop = Paradrop;
exports.default = Paradrop;
//# sourceMappingURL=Paradrop.js.map