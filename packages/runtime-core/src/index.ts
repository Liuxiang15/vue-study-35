export {
  VNode,
  openBlock,
  createBlock,
  createVNode,
  Text,
  Empty,
  Fragment,
  Portal
} from './vnode'

export { nextTick } from './scheduler'
export {
  createComponent,
  getCurrentInstance,
  FunctionalComponent
} from './component'
export { createRenderer, RendererOptions } from './createRenderer'
export { Slot, Slots } from './componentSlots'
export { PropType, ComponentPropsOptions } from './componentProps'

export * from './apiReactivity'
export * from './apiWatch'
export * from './apiLifecycle'
export * from './apiInject'
export * from './patchFlags'
export * from './typeFlags'