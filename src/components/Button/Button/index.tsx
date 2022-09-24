import React, { PropsWithChildren } from "react"
import cx from "classnames"
import styled from "./Button.module.scss"

const VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  IMPORTANT: "important",
  TEXT: "text",
} as const

export type ButtonProps = {
  /**
   * Specify the type of the
   */
  variant?: typeof VARIANT[keyof typeof VARIANT]
  /**
   * The size is full of the button.
   */
  block?: boolean
  /**
   * Specify whether the Button is currently selected
   */
  selected?: boolean
  /**
   * The button's key for the ButtonGroup.
   */
  eventKey?: ReactProps.EventKey
  /**
   * Provide an optional function to be called when the button element is clicked
   */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    eventKey?: { eventKey?: ReactProps.EventKey },
  ) => void
} & ReactProps.Component

export const Button = ({
  variant = "primary",
  selected = false,
  block = false,
  className,
  children = "Click",
  eventKey,
  onClick,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={cx(
        "core-uikit-button",
        styled.wrapper,
        styled[variant],
        { [styled.block]: block },
        { [styled.selected]: selected },
        className,
      )}
      style={props.style}
      onClick={e => {
        onClick && onClick(e, { eventKey: eventKey })
      }}
      {...props}>
      {children}
    </button>
  )
}

export default Button
