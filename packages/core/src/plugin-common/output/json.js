/**
 * @module output/json
 */

import * as plugins from '../../plugins/'
import * as util from '../../util/'
import logger from '../../logger'

/**
 * Append commas to every item but the last. Should unfortunately, probably be a utility.
 *
 * @access private
 *
 * @param {String} item
 * @param {Number} index
 * @param {Array<String>} array
 *
 * @return {String} modified item
 */
const appendCommas = (string, index, array) => string + (index < array.length - 1 ? ',' : '')

/**
 * Convert a JSON array or object to HTML.
 *
 * @access private
 *
 * @param {Object|Array} src - The data
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} string form
 */
const getJsonObject = function (src, dict) {
  const isArray = Array.isArray(src)
  let entries

  if (isArray) {
    entries = src.map(entry => getJsonValue(entry, dict))
  } else {
    entries = Object.keys(src)
      // remove values that cannot be stringified, as is custom
      .filter(prop => JSON.stringify(src[prop]))
      .map(prop => `"${prop}": ${getJsonValue(src[prop], dict)}`)
  }

  entries = entries.map(appendCommas).map(entry => dict.listItem.join(entry))
  entries = dict.list.join(entries.join(''))

  return isArray ? `[${entries}]` : `{${entries}}`
}

/**
 * Convert JSON to HTML.
 *
 * @access private
 *
 * @param {*} src - The data
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} string form
 */
const getJsonValue = function (src, dict) {
  if (typeof src === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]'
    } else if (Object.keys(src).length === 0) {
      return '{}'
    } else {
      return getJsonObject(src, dict)
    }
  } else {
    // Primitive values are generally fine, and if they're not JSON.stringify
    // returns undefined which is the only falsy value it returns (no empty
    // strings).
    return JSON.stringify(src) || 'null'
  }
}

/**
 * Get a JSON string from CSL
 *
 * @access protected
 * @method getJson
 *
 * @param {Array<CSL>} src - Input CSL
 * @param {Cite.get.dict~dict} dict - Dictionary
 *
 * @return {String} JSON string
 */
const getJson = function (src, dict) {
  let entries = src.map(entry => getJsonObject(entry, dict))
  entries = entries.map(appendCommas).map(entry => dict.entry.join(entry))
  entries = entries.join('')

  return dict.bibliographyContainer.join(`[${entries}]`)
}

/**
 * Get a JSON HTML string from CSL
 *
 * @access protected
 * @method getJsonWrapper
 * @deprecated use the generalised method: {@link module:output/json~getJson}
 *
 * @param {Array<CSL>} src - Input CSL
 *
 * @return {String} JSON HTML string
 */
const getJsonWrapper = function (src) {
  return getJson(src, plugins.dict.get('html'))
}

export { getJsonWrapper }
export default {
  data (data, { type, format = type || 'text' } = {}) {
    if (format === 'object') {
      return util.deepCopy(data)
    } else if (format === 'text') {
      return JSON.stringify(data, null, 2)
    } else {
      logger.warn('[core]', 'This feature (JSON output with special formatting) is unstable. See https://github.com/larsgw/citation.js/issues/144')
      return getJson(data, plugins.dict.get(format))
    }
  },
  ndjson (data) {
    return data.map(entry => JSON.stringify(entry)).join('\n')
  }
}
