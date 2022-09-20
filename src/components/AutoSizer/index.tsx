import React, { useState, useEffect, useRef } from "react"
import styled from "./AutoSizer.module.scss"

type AutoSizerProps = {
  children: ({ width, height }: { width: number; height: number }) => React.ReactNode
}
const AutoSizer = (props: AutoSizerProps) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [])

  useEffect(() => {
    const update = () => {
      if (!ref.current) return
      setWidth(ref.current.clientWidth)
      setHeight(ref.current.clientHeight)
    }
    window.addEventListener("resize", update)
  }, [])

  return (
    <div ref={ref} className={styled.wrapper}>
      {props.children({ width, height })}
    </div>
  )
}

export default AutoSizer
