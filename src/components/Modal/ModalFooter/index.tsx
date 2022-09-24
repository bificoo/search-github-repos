import cx from "classnames"
import styled from "./ModalFooter.module.scss"

export type ModalFooterProps = ReactProps.Component

const ModalFooter = (props: ModalFooterProps) => {
  return (
    <footer className={cx(styled.wrapper, props.className)} style={props.style}>
      {props.children}
    </footer>
  )
}

export default ModalFooter
