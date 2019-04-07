function getLastElement(list) {
  const lastIdx = [...list].reverse().findIndex(item => item.type === 'element')
  const idx = list.length - 1 - lastIdx
  const lefts = list.slice(0, idx)
  const rights = list.slice(idx + 1)
  const item = list[idx]
  return [lefts, item, rights]
}

/**
 * Returns the last item in a list.
 * @private
 *
 * @template T
 * @param {T[]} list
 * @returns {?T}
 *
 * @example
 *     last([1, 2, 3, 4, 5])
 *     => 5

 *     last([])
 *     => undefined
 */

function last(list) {
  if (!list.length) return
  return list[list.length - 1]
}

/**
 * Trims `n` items off the end of an array.
 * @private
 *
 * @template T
 * @param {T[]} list
 * @param {number} n
 * @returns {T[]}
 *
 * @example
 *     trimEnd(['a', 'b', 'c', 'd', 'e'], 1)
 *     => ['a', 'b', 'c', 'd']
 *
 *     trimEnd(['a', 'b', 'c', 'd', 'e'], 2)
 *     => ['a', 'b', 'c']
 */

function trimEnd(list, n = 1) {
  /** @type T[] */
  const result = list.slice(0, list.length - n)
  return result
}

export default getLastElement
