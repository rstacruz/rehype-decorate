/** @typedef {import('./types').HastProps} State */

/**
 * @callback ReduceCallback
 * @param {State} state
 * @param {string} string
 * @returns {[State, string]}
 */

/**
 * Gets props from a directive.
 *
 * @param {string} input
 *
 * @example
 *     getProps('.hello .hi #world')
 *     // => { className: ['hello', 'hi'], id: 'world' }

 *     getProps('.hello')
 *     // => { className: ['hello'] }
 */

export default function getProps(input) {
  return reduce(input, {}, (
    state /** @type State */,
    input /** @type string */
  ) => {
    let m
    ;[m, input] = match(input, /^\s*\.([a-zA-Z0-9\-_]+)/)
    if (m) return [addClassName(state, m[1]), input]
    ;[m, input] = match(input, /^\s*#([a-zA-Z0-9\-_]+)/)
    if (m) return [{ ...state, id: m[1] }, input]
    ;[m, input] = match(input, /^\s*([a-zA-Z0-9\-_]+)="([^"]*)"/)
    if (m) return [{ ...state, [m[1]]: m[2] }, input]
    ;[m, input] = match(input, /^\s*([a-zA-Z0-9\-_]+)='([^']*)'/)
    if (m) return [{ ...state, [m[1]]: m[2] }, input]
    ;[m, input] = match(input, /^\s*([a-zA-Z0-9\-_]+)=([^ ]*)/)
    if (m) return [{ ...state, [m[1]]: m[2] }, input]
    ;[m, input] = match(input, /^\s*([a-zA-Z0-9\-_]+)/)
    if (m) return [{ ...state, [m[1]]: true }, input]
    ;[m, input] = match(input, /^\s+/)
    if (m) return [state, input]

    // Terminate the loop
    return [state, '']
  })
}

/**
 * Matches a string to a regexp. Returns a tuple of the result and the rest.
 *
 * @param {string} str
 * @param {RegExp} re
 *
 * @private
 *
 * @example
 *      match('abc123456', /^abc/)
 *      => [ ['abc'], '123456' ]
 *
 *      match('abc123456', /^XYZ/)
 *      => [ null, 'abc123456' ]
 */

function match(str, re) {
  const m = str.match(re)

  if (m) {
    const rest = str.substr(m[0].length)
    return [m, rest]
  } else {
    return [null, str]
  }
}

/**
 * Keep running `fn(state, input) => [state, input]` until input is exhausted.
 * @param {string} input
 * @param {State} state
 * @param {ReduceCallback} fn
 * @private
 */

function reduce(input, state, fn) {
  if (!input || input.length === 0) return state
  ;[state, input] = fn(state, input)
  return reduce(input, state, fn)
}

/**
 * Adds a class name to properties.
 *
 * @param {State} state
 * @param {string} className
 * @returns {State}
 * @private
 */

function addClassName(state, className) {
  return {
    ...state,
    className: [...(state.className || []), className]
  }
}
