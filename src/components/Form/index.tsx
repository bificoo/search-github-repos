import FormBase from "./Form"

import FormInput from "./FormInput"
import FormGroup from "./FormGroup"

import InputGroup, { Prepend, Append } from "./InputGroup"
export type { FormProps } from "./Form"
export type { FormInputProps } from "./FormInput"
export type { InputGroupProps, PrependProps, AppendProps } from "./InputGroup"

const Form = Object.assign(FormBase, {
  Group: FormGroup,
  Input: FormInput,
})

export { InputGroup, Prepend, Append }
export default Form
