import ModalBase from "./Modal"
import CustomModal from "./CustomModal"
import ModalDialog from "./ModalDialog"
import ModalHeader from "./ModalHeader"
import ModalTitle from "components/Modal/ModalTitle"
import ModalBody from "./ModalBody"
import ModalFooter from "./ModalFooter"
import { open, withAlert, withConfirm, ModalConfig } from "./withOpen"

export type { ModalProps } from "./Modal"
export type { CustomModalProps } from "./CustomModal"
export type { ModalHeaderProps } from "./ModalHeader"
export type { ModalTitleProps } from "./ModalTitle"
export type { ModalFooterProps } from "./ModalFooter"

const Modal = Object.assign(ModalBase, {
  alert: (config: ModalConfig) => open(ModalBase, withAlert(config)),
  confirm: (config: ModalConfig) => open(ModalBase, withConfirm(config)),
  Dialog: ModalDialog,
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
})

export { CustomModal }
export default Modal
