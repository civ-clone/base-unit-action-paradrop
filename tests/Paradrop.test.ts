import { hasFullMoves, paradropCriteria } from '../lib/criteria';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Generator from '@civ-clone/core-world-generator/Generator';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Paradrop from '../Paradrop';
import Paradropped from '../UnitImprovements/Paradropped';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import { Water } from '@civ-clone/core-terrain/Types';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import paradropRules from '../lib/paradropRules';
import paradropped from '../lib/paradropped';

class Grassland extends Terrain {}
class Ocean extends Water {}
class Paratroopers extends Unit {}
class Musketeers extends Unit {}

// `@COSMIC`'s paradrop range (survey-units §4.1, OpenCiv2 `unit_paradrop`: a target further than it is refused).
const range = 10;

describe('Paradrop', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      unitRegistry = new UnitRegistry(),
      unitImprovementRegistry = new UnitImprovementRegistry(),
      world = new World(new Generator(40, 40)),
      tile = (x: number, terrain: Terrain = new Grassland()): Tile =>
        new Tile(x, 0, terrain, world, ruleRegistry),
      player = new Player(),
      enemy = new Player(),
      from = tile(0),
      unit = new Paratroopers(null, player, from, ruleRegistry),
      // The city (or airbase) the unit stands on is the only tile it can drop from.
      criteria = paradropCriteria(
        { unitImprovementRegistry, unitRegistry },
        {
          canParadrop: (candidate: Unit): boolean =>
            candidate instanceof Paratroopers,
          canDropFrom: (candidate: Unit, dropFrom: Tile): boolean =>
            dropFrom === from,
          range,
          hasFullMoves: (): boolean => true,
        }
      ),
      offered = (to: Tile, by: Unit = unit): boolean =>
        criteria.every((criterion: Criterion): boolean =>
          criterion.validate(by, to, by.tile())
        );

    unitRegistry.register(unit);

    return {
      enemy,
      from,
      offered,
      player,
      ruleRegistry,
      tile,
      unit,
      unitImprovementRegistry,
      unitRegistry,
    };
  };

  describe('paradropCriteria', (): void => {
    it('allows a land tile up to the range away, and not one further', (): void => {
      const { offered, tile } = setUp();

      expect(offered(tile(1))).to.true;
      expect(offered(tile(range))).to.true;
      expect(offered(tile(range + 1))).to.false;
    });

    it('refuses water and the tile the unit is on', (): void => {
      const { from, offered, tile } = setUp();

      expect(offered(tile(3, new Ocean()))).to.false;
      expect(offered(from)).to.false;
    });

    it("refuses a tile with another player's unit, but not one with the unit's own player's", (): void => {
      const { enemy, offered, player, ruleRegistry, tile, unitRegistry } =
          setUp(),
        theirs = tile(4),
        ours = tile(5);

      unitRegistry.register(
        new Musketeers(null, enemy, theirs, ruleRegistry),
        new Musketeers(null, player, ours, ruleRegistry)
      );

      expect(offered(theirs)).to.false;
      expect(offered(ours)).to.true;
    });

    it('refuses a unit that cannot paradrop, or one not on a tile it can drop from', (): void => {
      const { offered, player, ruleRegistry, tile, unit } = setUp(),
        musketeers = new Musketeers(null, player, unit.tile(), ruleRegistry);

      expect(offered(tile(2), musketeers)).to.false;

      unit.setTile(tile(1));

      expect(offered(tile(2))).to.false;
    });

    it('refuses a unit already paradropped this turn', (): void => {
      const { offered, tile, unit, unitImprovementRegistry } = setUp();

      unitImprovementRegistry.register(new Paradropped(unit));

      expect(offered(tile(2))).to.false;
    });

    // `unit_cmd_paradrop`: only with no moves used.
    it('`hasFullMoves`: moves at least the movement', (): void => {
      const unit = (moves: number, movement: number): Unit =>
        ({
          moves: () => ({ value: () => moves }),
          movement: () => ({ value: () => movement }),
        } as unknown as Unit);

      expect(hasFullMoves(unit(1, 1))).to.true;
      expect(hasFullMoves(unit(2 / 3, 1))).to.false;
    });
  });

  describe('perform', (): void => {
    const perform = (
      cityFor: (set: ReturnType<typeof setUp>) => City | null = () => null
    ) => {
      const set = setUp(),
        { ruleRegistry, tile, unit, unitImprovementRegistry } = set,
        city = cityFor(set),
        to = tile(6),
        moved: [Unit, UnitAction][] = [],
        cityRegistry = {
          getByTile: (candidate: Tile): City | null =>
            candidate === to ? city : null,
        } as unknown as CityRegistry;

      ruleRegistry.register(
        new Moved(
          new Effect((movedUnit: Unit, action: UnitAction): void => {
            moved.push([movedUnit, action]);
          })
        )
      );

      unit.moves().set(1);
      unit.setDamage(4);

      const action = new Paradrop(
        unit.tile(),
        to,
        unit,
        ruleRegistry,
        cityRegistry,
        unitImprovementRegistry
      );

      action.perform();

      return { ...set, action, moved, to };
    };

    const city = (owner: Player, captured: Player[]): City =>
      ({
        player: (): Player => owner,
        capture: (by: Player): void => {
          captured.push(by);
        },
      } as unknown as City);

    it('puts the unit on the tile, marks it `Paradropped` and runs the `Moved` rules, using no moves', (): void => {
      const { action, moved, to, unit, unitImprovementRegistry } = perform();

      expect(unit.tile()).to.equal(to);
      expect(paradropped(unit, unitImprovementRegistry)).to.true;
      expect(moved).to.deep.equal([[unit, action]]);
      expect(unit.moves().value()).to.equal(1);
      expect(unit.damage()).to.equal(4);
    });

    // `unit_paradrop`: into a city of another player, the unit's damage is cleared and the city captured.
    it("captures an empty city of another player, clearing the unit's damage", (): void => {
      const captured: Player[] = [],
        enemy = new Player(),
        { player, unit } = perform(() => city(enemy, captured));

      expect(captured).to.deep.equal([player]);
      expect(unit.damage()).to.equal(0);
    });

    it("doesn't capture its own player's city", (): void => {
      const captured: Player[] = [],
        { unit } = perform(({ player }) => city(player, captured));

      expect(captured).to.deep.equal([]);
      expect(unit.damage()).to.equal(4);
    });
  });

  describe('paradropRules', (): void => {
    it("takes `Paradropped` off the units of the player whose turn starts, and only theirs (OpenCiv2's flag clearing)", (): void => {
      const {
          enemy,
          player,
          ruleRegistry,
          tile,
          unit,
          unitImprovementRegistry,
        } = setUp(),
        other = new Paratroopers(null, enemy, tile(3), ruleRegistry);

      unitImprovementRegistry.register(
        new Paradropped(unit),
        new Paradropped(other)
      );

      const [rule] = paradropRules('test', { unitImprovementRegistry });

      expect(rule.id()).to.equal('test:paradrop/clear-paradropped');

      ruleRegistry.register(rule);
      ruleRegistry.process(TurnStart, player);

      expect(paradropped(unit, unitImprovementRegistry)).to.false;
      expect(paradropped(other, unitImprovementRegistry)).to.true;
    });
  });
});
