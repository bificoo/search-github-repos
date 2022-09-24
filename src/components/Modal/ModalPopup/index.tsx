import Popup from "reactjs-popup"
import { PopupProps } from "reactjs-popup/dist/types"

export type ModalPopupProps = {
  /**
   * Should the modal appear on screen or not
   */
  open?: boolean
  backdrop?: boolean
} & Partial<
  Pick<PopupProps, "open" | "lockScroll" | "closeOnDocumentClick" | "onClose" | "children">
>

const ModalPopup = ({
  open = false,
  backdrop = true,
  lockScroll = true,
  ...props
}: ModalPopupProps) => {
  return (
    <Popup
      modal
      nested
      lockScroll={lockScroll}
      open={open}
      closeOnDocumentClick={backdrop}
      closeOnEscape
      onClose={props.onClose}
      contentStyle={{
        background: "transparent",
        border: "none",
        width: "auto",
      }}
      overlayStyle={{
        backgroundColor: "#22100433",
      }}>
      {props.children}
    </Popup>
  )
}

export default ModalPopup
