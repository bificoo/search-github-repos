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
  const ref = useRef<T>(null)
  const options = useRef({ root, rootMargin, threshold })
  const [inView, setInView] = useState<boolean>()

  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    if (ref.current) {
      observer.current = new IntersectionObserver(([entry]) => {
        setInView(entry?.isIntersecting)
      }, options.current)
      observer.current?.observe(ref.current)
    }
    return () => {
      if (ref.current) {
        observer.current?.unobserve(ref.current)
      } else {
        observer.current?.disconnect()
      }
    }
  }, [])

  return { ref, inView }
}

export default useInView
