// @flow

export type HastProps = {
  className?: string[]
}

export type ElementNode = {|
  type: 'element',
  properties: HastProps,
  children?: HastNode[]
|}

export type CommentNode = {|
  type: 'comment',
  value: string
|}

export type TextNode = {|
  type: 'text',
  value: string
|}

export type HastNode = TextNode | ElementNode | CommentNode

// Options passed onto rehype-decorate
export type Options = {}
