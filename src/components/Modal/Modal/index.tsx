import ModalPopup from "../ModalPopup"
import ModalDialog from "../ModalDialog"
import { ModalPopupProps } from "../ModalPopup"
import { PopupProps } from "reactjs-popup/dist/types"

export type ModalProps = ModalPopupProps &
  ReactProps.WithStyle &
  Partial<Pick<PopupProps, "open" | "lockScroll" | "onClose" | "children">>

const Modal = (props: ModalProps) => {
  return (
    <ModalPopup
      open={props.open}
      closeOnDocumentClick={props.backdrop}
      lockScroll={props.lockScroll}
      onClose={props.onClose}>
      <ModalDialog style={props.style}>{props.children}</ModalDialog>
    </ModalPopup>
  )
}

export default Modal
