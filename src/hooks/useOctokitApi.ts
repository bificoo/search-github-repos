import { useCallback, useState } from "react"
import { RequestParameters } from "@octokit/types"
import { Octokit } from "@octokit/rest"
import { throttle } from "utils"
import Modal from "components/Modal"

type OctokitApiProps = {
  url: string
  options?: {
    throttle?: number
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
  accept: "application/vnd.github+json",
  auth: "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",
})

export default function useOctokitApi<T>(props: OctokitApiProps): OctokitApiResponse<T> {
  const [state, setState] = useState<OctokitApiState<T>>({
    error: null,
    loading: false,
    data: null,
    params: null,
  })

  const throttleExecute = throttle<RequestParameters>(params => {
    setState(() => ({ data: null, error: null, loading: true, params }))
    octokit
      .request(props.url, params)
      .then(response => {
        if (response.status === 200) {
          setState(prev => ({ ...prev, data: response.data }))
        }
      })
      .catch(error => {
        if (error?.response?.data?.message) {
          Modal.alert({
            title: "Warning",
            content: error.response.data.message,
            confirmText: "OK",
          })
        }
        throw error
      })
      .finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
  }, props.options?.throttle ?? 3000)

  const execute = useCallback(throttleExecute, [props.url])

  return [state, execute]
}
