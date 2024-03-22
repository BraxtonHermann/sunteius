/* eslint-env mocha */

const assert = require('assert')
const { plugins } = require('../src/')

const simple = [{
  id: 'Q23571040',
  type: 'article-journal',
  title: 'Correlation of the Base Strengths of Amines 1',
  DOI: '10.1021/ja01577a030',
  author: [
    {
      given: 'H. K.',
      family: 'Hall'
    }
  ],
  issued: {
    'date-parts': [[
      '1957',
      '1',
      '1'
    ]]
  },
  'container-title': 'Journal of the American Chemical Society',
  volume: '79',
  issue: '20',
  page: '5441-5444'
}]

const string = '[\n  {\n    id: "Q23571040",\n    type: "article-journal",\n    title: "Correlation of the Base Strengths of Amines 1",\n    DOI: "10.1021/ja01577a030",\n    author: [\n      {\n\tgiven: "H. K.",\n\tfamily: "Hall"\n      }\n    ],\n    issued: {\n      date-parts: [\n\t[ "1957", "1", "1" ]\n      ]\n    },\n    container-title: "Journal of the American Chemical Society",\n    volume: "79",\n    issue: "20",\n    page: "5441-5444"\n  }\n]'

const yearSuffix = [{ id: 'a', author: [{ literal: 'foo' }], issued: { 'date-parts': [[2018]] }, 'year-suffix': 'a' }]
const label = [{ 'id': 'b', 'citation-label': 'foo', 'type': 'book' }]

const inputData = {
  '@else/json': {
    'as JSON string': [JSON.stringify(simple), simple],
    'as JS Object string': [string, simple]
  },
  '@empty/text': {
    simple: ['', []]
  },
  '@empty/whitespace+text': {
    'tabs, spaces and newlines': ['   \t\n \r  ', []]
  },
  '@empty': {
    '(null)': [null, []],
    '(undefined)': [undefined, []]
  }
}

describe('input', function () {
  for (let type in inputData) {
    describe(type, function () {
      it('is registered', function () {
        assert(plugins.input.has(type))
      })

      for (let name of Object.keys(inputData[type])) {
        let [input, expected] = inputData[type][name]
        describe(name, function () {
          it('parses type', function () {
            assert.strictEqual(plugins.input.type(input), type)
          })
          it('parses data', function () {
            assert.deepStrictEqual(
              plugins.input.chain(input, { generateGraph: false }),
              expected
            )
          })
        })
      }
    })
  }
})

const outputData = {
  data: {
    'plain text': [simple, JSON.stringify(simple, null, 2)],
    'object': [simple, simple, { format: 'object' }]
  },
  ndjson: {
    'normal': [simple, simple.map(entry => JSON.stringify(entry)).join('\n')]
  },
  label: {
    'normal': [simple, { [simple[0].id]: 'Hall1957Correlation' }],
    'with year-suffix': [yearSuffix, { [yearSuffix[0].id]: 'foo2018a' }],
    'with own label': [label, { [label[0].id]: 'foo' }]
  }
}

describe('output', function () {
  for (let type in outputData) {
    describe(type, function () {
      it('is registered', function () {
        assert(plugins.output.has(type))
      })

      for (let name of Object.keys(outputData[type])) {
        let [input, expected, ...opts] = outputData[type][name]
        let actual = plugins.output.format(type, input, ...opts)
        it(`with ${name} works`, function () {
          assert.deepStrictEqual(
            typeof actual === 'string' ? actual.trim() : actual,
            expected
          )
        })
      }
    })
  }
})
