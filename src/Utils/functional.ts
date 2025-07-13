export function apply<T, R>(value: T | undefined, transform: (value: T) => R): R | undefined {
  if (value === undefined) {
    return undefined
  }
  return transform(value)
}
