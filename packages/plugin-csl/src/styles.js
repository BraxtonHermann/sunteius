/**
 * @module output/csl
 */

import { util } from '@citation-js/core'

/**
 * Object containing CSL templates
 *
 * Templates from the [CSL Project](http://citationstyles.org/)<br>
 * [REPO](https://github.com/citation-style-language/styles), [LICENSE](https://creativecommons.org/licenses/by-sa/3.0/)
 *
 * Accesed 10/22/2016
 *
 * @access private
 * @constant defaultTemplates
 */
import defaultTemplates from './styles.json'

/**
 * @type Cite.util.Register
 * @member
 */
const templates = new util.Register(defaultTemplates)

/* istanbul ignore next: deprecated */
/**
 * Retrieve CSL style
 *
 * @access protected
 * @deprecated
 * @param {String} [style="apa"] - style name
 * @return {String} CSL style
 */
const fetchStyle = style => {
  if (templates.has(style)) {
    return templates.get(style)
  } else {
    return templates.get('apa')
  }
}

export default fetchStyle
export { templates }
