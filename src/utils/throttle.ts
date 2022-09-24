type throttleFunction<T> = (args: T) => void

export default function throttle<T>(fn: throttleFunction<T>, delay = 500): throttleFunction<T> {
  let inThrottle = false

  return function (this: unknown, ...args) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), delay)
    }
  }
}
