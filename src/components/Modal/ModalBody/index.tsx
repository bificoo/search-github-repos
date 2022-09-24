import cx from "classnames"
import styled from "./ModalBody.module.scss"

export type ModalBodyProps = ReactProps.Component

const ModalBody = (props: ModalBodyProps) => {
  return (
    <main className={cx(styled.wrapper, props.className)} style={props.style}>
      {props.children}
    </main>
  )
}

export default ModalBody
