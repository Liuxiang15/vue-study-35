// Patch flags are optimization hints generated by the compiler.
// when a block with dynamicChildren is encountered during diff, the algorithm
// enters "optimized mode". In this mode, we know that the vdom is produced by
// a render function generated by the compiler, so the algorithm only needs to
// handle updates explicitly marked by these patch flags.

// Patch flags can be combined using the | bitwise operator and can be checked
// using the & operator, e.g.
//
//   const flag = TEXT | CLASS
//   if (flag & TEXT) { ... }
//
// Check the `patchElement` function in './renderer.ts' to see how the
// flags are handled during diff.

export const enum PatchFlags {
  // Indicates an element with dynamic textContent (children fast path)
  TEXT = 1,

  // Indicates an element with dynamic class binding.
  CLASS = 1 << 1,  // 10

  // Indicates an element with dynamic style
  // The compiler pre-compiles static string styles into static objects
  // + detects and hoists inline static objects
  // e.g. style="color: red" and :style="{ color: 'red' }" both get hoisted as
  //   const style = { color: 'red' }
  //   render() { return e('div', { style }) }
  STYLE = 1 << 2,

  // Indicates an element that has non-class/style dynamic props.
  // Can also be on a component that has any dynamic props (includes
  // class/style). when this flag is present, the vnode also has a dynamicProps
  // array that contains the keys of the props that may change so the runtime
  // can diff them faster (without having to worry about removed props)
  PROPS = 1 << 3,

  // Indicates an element with props with dynamic keys. When keys change, a full
  // diff is always needed to remove the old key. This flag is mutually
  // exclusive with CLASS, STYLE and PROPS.
  FULL_PROPS = 1 << 4,

  // Indicates an element with event listeners (which need to be attached
  // during hydration)
  HYDRATE_EVENTS = 1 << 5,

  // Indicates a fragment whose children order doesn't change.
  STABLE_FRAGMENT = 1 << 6, // 64

  // Indicates a fragment with keyed or partially keyed children
  KEYED_FRAGMENT = 1 << 7,

  // Indicates a fragment with unkeyed children.
  UNKEYED_FRAGMENT = 1 << 8,

  // Indicates an element that only needs non-props patching, e.g. ref or
  // directives (onVnodeXXX hooks). since every patched vnode checks for refs
  // and onVnodeXXX hooks, it simply marks the vnode so that a parent block
  // will track it.
  NEED_PATCH = 1 << 9,

  // Indicates a component with dynamic slots (e.g. slot that references a v-for
  // iterated value, or dynamic slot names).
  // Components with this flag are always force updated.
  DYNAMIC_SLOTS = 1 << 10,

  // SPECIAL FLAGS -------------------------------------------------------------

  // Special flags are negative integers. They are never matched against using
  // bitwise operators (bitwise matching should only happen in branches where
  // patchFlag > 0), and are mutually exclusive. When checking for a special
  // flag, simply check patchFlag === FLAG.

  // Indicates a hoisted static vnode. This is a hint for hydration to skip
  // the entire sub tree since static content never needs to be updated.
  HOISTED = -1,

  // A special flag that indicates that the diffing algorithm should bail out
  // of optimized mode. For example, on block fragments created by renderSlot()
  // when encountering non-compiler generated slots (i.e. manually written
  // render functions, which should always be fully diffed)
  // OR manually cloneVNodes
  BAIL = -2
}

// dev only flag -> name mapping
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
