// @flow

export type HastNode = {
  type: 'text' | 'element'
}

// Options passed onto rehype-decorate
export type Options = {}

export type HastProps = {
  className?: string
}
