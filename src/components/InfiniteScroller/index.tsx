import React, { useEffect } from "react"
import useInView from "hooks/useInView"

type InfiniteScrollerProps<T> = {
  domList: T[]
  onLastInView: () => void
}
const InfiniteScroller = <T extends React.ReactNode>(props: InfiniteScrollerProps<T>) => {
  const { ref, inView } = useInView<HTMLDivElement>({})

  useEffect(() => {
    console.info("InfiniteScroller inView", inView)
    inView && props.onLastInView()
  }, [inView])

  console.info("props.domList.length", props.domList.length)
  return (
    <>
      {props.domList.map((child, index) => {
        return (
          <div key={index} {...(index === props.domList.length - 1 ? { ref } : {})}>
            {child}
          </div>
        )
      })}
    </>
  )
}

export default InfiniteScroller
