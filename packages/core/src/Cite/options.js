import { validateOutputOptions as validate } from './validate'

/**
 * @memberof Cite#
 *
 * @property {Cite~OutputOptions} defaultOptions - default output options
 */
const defaultOptions = { format: 'real', type: 'json', style: 'csl', lang: 'en-US' }

/**
 * Change the default options of a `Cite` object.
 *
 * @memberof Cite#
 *
 * @param {Cite~OutputOptions} options - The options for the output
 * @param {Boolean} [log=false] - Show this call in the log
 *
 * @return {Cite} The updated parent object
 */
const options = function (options, log) {
  validate(options)

  if (log) {
    this.save()
  }

  Object.assign(this._options, options)

  return this
}

export { options, defaultOptions }
