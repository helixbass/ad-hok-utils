const pick = <TObject, TKey extends keyof TObject>(
  keys: TKey[],
  object: TObject,
): Pick<TObject, TKey> => {
  const ret: any = {}
  for (const key in object) {
    if (keys.indexOf(key as any) >= 0) {
      ret[key] = object[key]
    }
  }
  return ret
}

export default pick
