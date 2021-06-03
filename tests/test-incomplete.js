import { encode } from '../index.js'
import { assert } from 'chai'
import { Decoder } from '../decode.js'

const tests = {
  string: 'interesting string',
  number: 12345,
  buffer: Buffer.from('hello world'),
  bigint: 12345678910n,
  array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  set: new Set('abcdefghijklmnopqrstuvwxyz'.split('')),
  object: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }
}

suite('encode and decode tests with partial values', function () {
  const decoder = new Decoder({ objectMode: true, structures: [] })

  for (const [label, testData] of Object.entries(tests)) {
    test(label, () => {
      const encoded = encode(testData)
      assert.isTrue(Buffer.isBuffer(encoded), 'encode returns a Buffer')
      assert.deepStrictEqual(decoder.decode(encoded, encoded.length, true), testData, 'full buffer decodes well')
      const firstHalf = encoded.slice(0, Math.floor(encoded.length / 2))
      let value
      try {
        value = decoder.decode(firstHalf, firstHalf.length, true)
      } catch (err) {
        if (err.incomplete !== true) {
          assert.fail(`Should throw an error with .incomplete set to true, instead threw error <${err}>`)
        } else {
          return; // victory! correct outcome!
        }
      }
      assert.fail(`Should throw an error with .incomplete set to true, instead returned value ${JSON.stringify(value)}`)
    })
  }
})