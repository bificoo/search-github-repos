import React, { useCallback, useEffect, useRef, useState } from "react"
import { getInitialSetting } from "components/VirtualScroller/utils"
import styled from "./VirtualScroller.module.scss"
import usePrevious from "hooks/usePrevious"

export type Settings = {
  minIndex: number
  maxIndex: number
  startIndex: number
  viewportHeight: number
  itemHeight: number
  tolerance: number
}

export type CompoundSettings = {
  amount: number
  totalHeight: number
  toleranceHeight: number
  bufferHeight: number
  bufferedAmount: number
  topPaddingHeight: number
  bottomPaddingHeight: number
  initialPosition: number
} & Settings

type VirtualScrollerProps<T> = {
  data: T[]
  height: number
  viewportHeight: number
  renderItem: (data: T) => React.ReactNode
  renderLoading: () => React.ReactNode
}

const VirtualScroller = <T extends object>(props: VirtualScrollerProps<T>) => {
  const viewportElement = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<T[]>([])
  const settingsRef = useRef<CompoundSettings>(
    getInitialSetting({
      minIndex: 1,
      maxIndex: props.data.length,
      startIndex: 1,
      viewportHeight: props.viewportHeight,
      itemHeight: props.height,
      tolerance: 2,
    }),
  )
  const scrollTopRef = useRef(0)

  const getData = useCallback(
    (offset: number, limit: number) => {
      const data = []
      const start = Math.max(1, offset)
      const end = Math.min(offset + limit - 1, props.data.length)
      if (start <= end) {
        for (let i = start; i <= end; i++) {
          props.data[i] && data.push(props.data[i])
        }
      }
      return data
    },
    [props.data],
  )

  const scroll = useCallback(
    (scrollTop: number) => {
      scrollTopRef.current = scrollTop
      const { totalHeight, toleranceHeight, bufferedAmount, itemHeight, minIndex } =
        settingsRef.current
      const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight)
      const data = getData(index, bufferedAmount)
      const topPaddingHeight = Math.max(index * itemHeight, 0)
      const bottomPaddingHeight = Math.max(
        totalHeight - topPaddingHeight - data.length * itemHeight,
        0,
      )
      settingsRef.current = {
        ...settingsRef.current,
        topPaddingHeight,
        bottomPaddingHeight,
      }
      setData(data)
    },
    [getData],
  )

  const init = useRef(false)
  useEffect(() => {
    if (!init.current) {
      if (viewportElement.current) {
        viewportElement.current.scrollTop = settingsRef.current.initialPosition
      }
      if (!settingsRef.current.initialPosition) scroll(0)
      init.current = true
    }
  }, [])

  const prevSettings = usePrevious({
    maxIndex: props.data.length,
    viewportHeight: props.viewportHeight,
    itemHeight: props.height,
  })
  useEffect(() => {
    if (
      prevSettings?.maxIndex !== props.data.length ||
      prevSettings.viewportHeight !== props.viewportHeight ||
      prevSettings.itemHeight !== props.height
    ) {
      settingsRef.current = getInitialSetting({
        minIndex: 1,
        maxIndex: props.data.length,
        startIndex: 1,
        viewportHeight: props.viewportHeight,
        itemHeight: props.height,
        tolerance: 2,
      })
      scroll(scrollTopRef.current)
    }
  }, [scroll, props.data.length, props.viewportHeight, props.height])

  return (
    <div
      ref={viewportElement}
      className={styled.viewport}
      onScroll={e => scroll((e.target as HTMLDivElement).scrollTop)}
      style={{ height: settingsRef.current.viewportHeight }}>
      <div style={{ height: settingsRef.current.topPaddingHeight }} />
      {data.map(props.renderItem)}
      {props.renderLoading()}
      <div style={{ height: settingsRef.current.bottomPaddingHeight }} />
    </div>
  )
}

export default VirtualScroller
