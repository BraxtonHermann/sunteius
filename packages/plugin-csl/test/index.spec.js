/* eslint-env mocha */

const assert = require('assert')
require('../src/')
const { plugins } = require('@citation-js/core')
const data = require('./data')

let CSL = plugins.config.get('@csl')
CSL.templates.add('custom', `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">
  <bibliography>
    <layout>
      <text variable="title"/>
    </layout>
  </bibliography>
</style>`)
CSL.locales.add('custom', `<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="custom">
  <style-options punctuation-in-quote="true"/>
  <date form="text">
    <date-part name="month" suffix=" "/>
    <date-part name="day" suffix=", "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="no date" form="short">custom</term>
  </terms>
</locale>`)

describe('output', function () {
  for (let type in data) {
    describe(type, function () {
      it('is registered', function () {
        assert(plugins.output.has(type))
      })

      for (let name of Object.keys(data[type])) {
        let [input, expected, ...opts] = data[type][name]
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
