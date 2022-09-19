import useInView from "hooks/useInView"

type VirtualScrollerProps = {
  height: number
  name?: string
} & ReactProps.WithChildren

const VirtualScroller = (props: VirtualScrollerProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.1,
  })
  return (
    <div ref={ref} style={{ height: `${props.height}px` }}>
      {inView && props.children}
    </div>
  )
}

export default VirtualScroller
