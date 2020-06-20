import {useRef, useEffect} from 'react'

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (
  callback: () => void,
  delay: number | null,
  additionalDependenciesThatShouldTriggerResettingInterval: any[] = [],
): void => {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay, ...additionalDependenciesThatShouldTriggerResettingInterval])
}

export default useInterval
