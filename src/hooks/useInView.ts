import { useState, useRef, useEffect } from "react"

type useInViewProps<T extends HTMLElement> = {
  root?: T | null
  rootMargin?: string
  threshold?: number
}

const useInView = <T extends HTMLElement>({
  root = null,
  rootMargin = "0px",
  threshold = 1.0,
}: useInViewProps<T>) => {
  const [ref, setRef] = useState<T | null>(null)
  const options = useRef({ root, rootMargin, threshold })
  const [inView, setInView] = useState<boolean>()

  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    if (ref) {
      observer.current = new IntersectionObserver(([entry]) => {
        setInView(entry?.isIntersecting)
      }, options.current)
      observer.current?.observe(ref)
    } else {
      setInView(false)
    }
    return () => {
      if (ref) {
        observer.current?.unobserve(ref)
      } else {
        observer.current?.disconnect()
      }
    }
  }, [ref])

  return { ref: setRef, inView }
}

export default useInView
