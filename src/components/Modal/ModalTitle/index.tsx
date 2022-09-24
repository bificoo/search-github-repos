import cx from "classnames"
import styled from "./ModalTitle.module.scss"

export type ModalTitleProps = ReactProps.Component

const ModalTitle = (props: ModalTitleProps) => {
  return (
    <h1 className={cx(styled.wrapper, props.className)} style={props.style}>
      {props.children}
    </h1>
  )
}

export default ModalTitle
