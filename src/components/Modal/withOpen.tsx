import React from "react"
import ReactDOM from "react-dom"
import { ModalProps } from "./Modal"
import ModalHeader from "./ModalHeader"
import ModalTitle from "./ModalTitle"
import ModalBody from "./ModalBody"
import ModalFooter from "./ModalFooter"
import Button from "components/Button"

export type ModalConfig = {
  /**
   * The Modal header.
   */
  title?: string
  /**
   * The Modal content. (props.children > props.content)
   */
  content?: string
  /**
   * The text for confirm button.
   */
  confirmText?: string
  /**
   * The props for confirm button.
   */
  confirmButtonProps?: JSX.IntrinsicElements["button"]
  /**
   * A callback triggered whenever the modal is confirmed.
   */
  onConfirm?: () => void
  /**
   * The text for cancel button, if text is null button will be hidden
   */
  cancelText?: string | null
  /**
   * The props for cancel button.
   */
  cancelButtonProps?: JSX.IntrinsicElements["button"]
  /**
   * A callback triggered whenever the cancel button clicked.
   */
  onCancel?: () => void
  /**
   * A callback triggered whenever the modal is closed.
   */
  onClose?: () => void
} & ModalProps

export const getPopupRoot = () => {
  let popupRoot = document.getElementById("popup-root")
  if (!popupRoot) {
    popupRoot = document.createElement("div")
    popupRoot.setAttribute("id", "popup-root")
    document.body.appendChild(popupRoot)
  }
  return popupRoot
}

export function open(Modal: React.FC<ModalProps>, config: ModalConfig) {
  const modalRoot = getPopupRoot()
  const modalDiv = document.createElement("div")
  modalRoot.appendChild(modalDiv)

  function bindClose(config: ModalConfig) {
    const { onClose, onConfirm, onCancel, ...theOtherConfig } = config
    const bind = (fn?: () => void) =>
      fn
        ? () => {
            typeof fn === "function" && fn()
            close()
          }
        : close

    return {
      ...theOtherConfig,
      onConfirm: bind(onConfirm),
      onCancel: bind(onCancel),
      onClose: bind(onClose),
    }
  }

  function render(_config: ModalConfig) {
    const config = bindClose(_config)
    ReactDOM.render(
      <Modal
        open={config.open}
        lockScroll={config.lockScroll}
        backdrop={config.backdrop}
        onClose={config.onClose}>
        <ModalHeader>
          <ModalTitle>{config.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{config.content}</ModalBody>
        <ModalFooter>
          {!!config.cancelText && (
            <Button
              variant="secondary"
              onClick={() => {
                config.onCancel && config.onCancel()
                config.onClose && config.onClose()
              }}
              {...config.cancelButtonProps}>
              {config.cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              config.onConfirm && config.onConfirm()
              config.onClose && config.onClose()
            }}
            {...config.confirmButtonProps}>
            {config.confirmText}
          </Button>
        </ModalFooter>
      </Modal>,
      modalDiv,
    )
  }

  function update(newConfig: ModalProps) {
    render({
      ...config,
      ...newConfig,
      open: true,
    })
  }

  function close() {
    render({
      ...config,
      open: false,
    })
  }

  render({
    ...config,
    open: true,
  })

  return {
    destroy: close,
    update,
  }
}

export function withAlert(config: ModalConfig) {
  return {
    ...config,
    cancelText: null,
  }
}

export function withConfirm(config: ModalConfig) {
  return {
    ...config,
    cancelText: config.cancelText,
  }
}
