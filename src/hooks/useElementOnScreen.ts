import { useState, useRef, useEffect } from "react"

type useElementOnScreenProps = {
  root?: HTMLDivElement | null
  rootMargin?: string
  threshold?: number
}

const useElementOnScreen = <T extends HTMLElement>({
  root = null,
  rootMargin = "0px",
  threshold = 1.0,
}: useElementOnScreenProps) => {
  const node = useRef<null | T>(null)
  const options = useRef({ root, rootMargin, threshold })
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    if (node.current) {
      observer.current = new IntersectionObserver(([entry]) => {
        setEntry(entry)
      }, options.current)
      observer.current?.observe(node.current)
    }
    return () => {
      if (node.current) {
        observer.current?.unobserve(node.current)
      } else {
        observer.current?.disconnect()
      }
    }
  }, [])

  return { node, entry }
}

export default useElementOnScreen
