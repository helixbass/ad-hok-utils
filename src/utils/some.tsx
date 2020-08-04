const some = <TItem,>(
  test: (item: TItem) => boolean,
  array: TItem[],
): boolean => {
  for (let i = 0; i < array.length; i++) {
    if (test(array[i])) return true
  }
  return false
}

export default some
