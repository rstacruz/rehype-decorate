/** @typedef {import('./types').HastNode} HastNode */
/** @typedef {import('./types').HastProps} HastProps
/** @typedef {import('./types').Options} Options */

import getProps from './get_props'
import getLastElement from './get_last_element'

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
  // Check if it's a <!-- {.useful} --> comment
  const commentProps = parseComment(node)

  // If not, then noop
  if (!commentProps) return [...list, node]

  // Find the last element to apply the comment props to
  const [pre, item, post] = getLastElement(list)

  // When there's nothing to apply to, don't bother.
  // This only happens when list.length === 0
  if (!item) return [...pre, ...post]

  return [...pre, applyProps(item, commentProps), ...post]
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
