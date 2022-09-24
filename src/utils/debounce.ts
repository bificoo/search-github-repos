type debounceFunction<T> = (args: T) => void

export default function debounce<T>(fn: debounceFunction<T>, wait = 100): debounceFunction<T> {
  let timeout: NodeJS.Timeout | null = null

  return function (this: unknown, ...args) {
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }
}
