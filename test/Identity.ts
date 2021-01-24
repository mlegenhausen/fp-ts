import { eqNumber } from '../src/Eq'
import { identity, pipe } from '../src/function'
import * as _ from '../src/Identity'
import { monoidString } from '../src/Monoid'
import * as O from '../src/Option'
import { showString } from '../src/Show'
import * as U from './util'

describe('Identity', () => {
  describe('pipeables', () => {
    it('map', () => {
      U.deepStrictEqual(pipe(1, _.map(U.double)), 2)
    })

    it('ap', () => {
      const fab = U.double
      U.deepStrictEqual(pipe(fab, _.ap(1)), 2)
    })

    it('apSecond', () => {
      U.deepStrictEqual(pipe('a', _.apSecond('b')), 'b')
    })

    it('chain', () => {
      const f = (n: number) => n * 2
      U.deepStrictEqual(pipe(1, _.chain(f)), 2)
    })

    it('chainFirst', () => {
      const f = (n: number) => n * 2
      U.deepStrictEqual(pipe(1, _.chainFirst(f)), 1)
    })

    it('reduce', () => {
      U.deepStrictEqual(
        pipe(
          'b',
          _.reduce('a', (b, a) => b + a)
        ),
        'ab'
      )
    })

    it('foldMap', () => {
      U.deepStrictEqual(pipe('a', _.foldMap(monoidString)(identity)), 'a')
    })

    it('reduceRight', () => {
      const f = (a: string, acc: string) => acc + a
      U.deepStrictEqual(pipe('a', _.reduceRight('', f)), 'a')
    })

    it('alt', () => {
      const assertAlt = (a: _.Identity<number>, b: _.Identity<number>, expected: number) => {
        U.deepStrictEqual(
          pipe(
            a,
            _.alt(() => b)
          ),
          expected
        )
      }
      assertAlt(1, 2, 1)
    })

    it('extract', () => {
      U.deepStrictEqual(pipe(1, _.extract), 1)
    })

    it('extend', () => {
      const f = (fa: _.Identity<string>): number => fa.length
      U.deepStrictEqual(pipe('foo', _.extend(f)), 3)
    })

    it('duplicate', () => {
      U.deepStrictEqual(pipe('a', _.duplicate), 'a')
    })

    it('flatten', () => {
      U.deepStrictEqual(pipe('a', _.flatten), 'a')
    })

    it('traverse', () => {
      const traverse = _.traverse(O.Applicative)
      U.deepStrictEqual(pipe(1, traverse(O.some)), O.some(1))
      U.deepStrictEqual(
        pipe(
          1,
          traverse(() => O.none)
        ),
        O.none
      )
    })

    it('sequence', () => {
      const sequence = _.sequence(O.Applicative)
      U.deepStrictEqual(sequence(O.some('a')), O.some('a'))
      U.deepStrictEqual(sequence(O.none), O.none)
    })
  })

  it('getEq', () => {
    const S = _.getEq(eqNumber)
    U.deepStrictEqual(S.equals(1)(1), true)
    U.deepStrictEqual(S.equals(1)(2), false)
    U.deepStrictEqual(S.equals(2)(1), false)
  })

  it('getShow', () => {
    const S = _.getShow(showString)
    U.deepStrictEqual(S.show('a'), `"a"`)
  })

  it('do notation', () => {
    U.deepStrictEqual(
      pipe(
        _.of(1),
        _.bindTo('a'),
        _.bind('b', () => _.of('b'))
      ),
      { a: 1, b: 'b' }
    )
  })

  it('apS', () => {
    U.deepStrictEqual(pipe(_.of(1), _.bindTo('a'), _.apS('b', _.of('b'))), { a: 1, b: 'b' })
  })

  it('apT', () => {
    U.deepStrictEqual(pipe(_.of(1), _.tupled, _.apT(_.of('b'))), [1, 'b'])
  })
})
