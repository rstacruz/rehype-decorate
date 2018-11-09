// @flow

import { type HastProps } from './types'
export type State = HastProps

/**
 * Gets props from a directive.
 *
 * @example
 *     getProps('.hello .hi #world')
 *     // => { className: ['hello', 'hi'], id: 'world' }

 *     getProps('.hello')
 *     // => { className: ['hello'] }
 */

export default function getProps(input: string) {
  return reduce(input, {}, (state: State, input: string) => {
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
 * @private
 *
 * @example
 *      match('abc123456', /^abc/)
 *      => [ ['abc'], '123456' ]
 *
 *      match('abc123456', /^XYZ/)
 *      => [ null, 'abc123456' ]
 */

function match(str: string, re: RegExp) {
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
 * @private
 */

function reduce(
  input: string,
  state: State,
  fn: (State, string) => [State, string]
): State {
  if (!input || input.length === 0) return state
  ;[state, input] = fn(state, input)
  return reduce(input, state, fn)
}

/**
 * Adds a class name to properties.
 * @private
 */

function addClassName(state: State, className: string): State {
  return {
    ...state,
    className: [...(state.className || []), className]
  }
}
