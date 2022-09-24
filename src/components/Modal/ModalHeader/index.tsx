import cx from "classnames"
import styled from "./ModalHeader.module.scss"

export type ModalHeaderProps = ReactProps.Component

const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <header className={cx(styled.wrapper, props.className)} style={props.style}>
      {props.children}
    </header>
  )
}

export default ModalHeader
