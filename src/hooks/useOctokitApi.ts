import { useCallback, useState } from "react"
import { RequestParameters } from "@octokit/types"
import { Octokit } from "@octokit/rest"
import { debounce } from "utils"
import Modal from "components/Modal"

type OctokitApiProps = {
  url: string
  options?: {
    debounce?: number
  }
}

export type OctokitApiState<T> = {
  error: null
  loading: boolean
  data: T | null
  params: RequestParameters | null
}

export type OctokitApiResponse<T> = [OctokitApiState<T>, (params: RequestParameters) => void]

const octokit = new Octokit({
  type: "token",
  username: "bificoo",
  token: "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",
})

export default function useOctokitApi<T>(props: OctokitApiProps): OctokitApiResponse<T> {
  const [state, setState] = useState<OctokitApiState<T>>({
    error: null,
    loading: false,
    data: null,
    params: null,
  })

  const debounceExecute = debounce<RequestParameters>(params => {
    setState(() => ({ data: null, error: null, loading: true, params }))
    octokit
      .request(props.url, params)
      .then(response => {
        if (response.status === 200) {
          setState(prev => ({ ...prev, data: response.data }))
        }
      })
      .catch(error => {
        Modal.alert({
          title: "Warning",
          content: error?.response?.data?.message || "Please try again later",
          confirmText: "OK",
        })
      })
      .finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
  }, props.options?.debounce)

  const execute = useCallback(debounceExecute, [props.url])

  return [state, execute]
}
