export interface HastProps {
  className?: string[]
}

export interface ElementNode {
  type: 'element'
  properties: HastProps
  children?: HastNode[]
}

export interface CommentNode {
  type: 'comment'
  value: string
}

export interface TextNode {
  type: 'text'
  value: string
}

export type HastNode = TextNode | ElementNode | CommentNode

// Options passed onto rehype-decorate
export interface Options {}
