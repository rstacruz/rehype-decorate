/** @typedef {import('./types').HastNode} HastNode */
/** @typedef {import('./types').HastProps} HastProps
/** @typedef {import('./types').Options} Options */

import getProps from './get_props'

export const COMMENT = /^\s*{\s*(.*?)\s*}\s*$/

/**
 * Decorates.
 */

export default function decorate(root, options = {}) {
  // Nothing to do for leaf nodes
  if (!root.children) return root

  // Work and recurse
  const children = decorateFragment(root.children, options)
  return { ...root, children }
}

/**
 * Decorates a list of nodes.
 *
 * @param {HastNode[]} list
 * @param {Options} options
 * @returns {HastNode[]} list
 */

export function decorateFragment(list, options = {}) {
  // Depth-first recursion
  const newList = list.map(c => decorate(c, options))

  return newList.reduce(pushNode, [])
}

/**
 * Pushes a `node` into a list
 * This is a reducer.
 *
 * @param {HastNode[]} list
 * @param {HastNode} node
 * @returns {HastNode[]} list
 */

export function pushNode(list, node) {
  const commentProps = parseComment(node)

  // Noop for non-comments
  if (!commentProps) return [...list, node]

  // Replace the last.
  // TODO: Discard any empty text nodes
  const head = trimEnd(list)
  const tail = last(list)

  // This only happens when list.length === 0
  if (!tail) return []

  return [...head, applyProps(tail, commentProps)]
}

/**
 * Returns information about a comment node.
 *
 * @param {HastNode} node
 * @returns {?HastProps}
 *
 * @example
 *     comment = { type: 'comment', value: '{.hello.world}' }
 *     parseComment(comment)
 *     // => { className: ['hello', 'world'] }
 */

export function parseComment(node) {
  if (node.type !== 'comment') return

  const m = node.value.match(COMMENT)
  if (!m) return

  return getProps(m[1])
}

/**
 * Applies properties into a HAST node.
 *
 * @param {HastNode} node
 * @param {HastProps} props
 *
 * @example
 *     node = { type: 'element' }
 *     props = { className: ['hello'] }
 *
 *     nn = applyProps(node, props)
 *     // => {
 *     //   type: 'element',
 *     //   properties: { className: ['hello'] }
 *     // }
 */

function applyProps(node, props) {
  if (!node) return

  // Reject text nodes
  if (node.type !== 'element') return node

  const prevProps = node.properties || {}
  const className = [...(prevProps.className || []), ...(props.className || [])]

  /** @type HastNode */
  const result = {
    ...node,
    properties: {
      ...prevProps,
      ...props,
      className: className.length ? className : undefined
    }
  }

  return result
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
