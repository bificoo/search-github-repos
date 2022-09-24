import React from "react"
import { createRoot, Root } from "react-dom/client"
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

const POPUP_ROOT = "popup-root"
type ContainerType = (Element | DocumentFragment) & {
  [POPUP_ROOT]?: Root
}

function _render(node: React.ReactElement, container: ContainerType) {
  const root = container[POPUP_ROOT] || createRoot(container)
  root.render(node)
  container[POPUP_ROOT] = root
}

export function open(Modal: React.FC<ModalProps>, config: ModalConfig) {
  const container: ContainerType = Object.assign(document.createDocumentFragment(), {
    [POPUP_ROOT]: undefined,
  })

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
    _render(
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
      container,
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
