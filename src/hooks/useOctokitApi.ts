import { useCallback, useState } from "react"
import { RequestError, RequestParameters } from "@octokit/types"
import { Octokit } from "@octokit/rest"
import { throttle } from "utils"

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
      .catch((error: RequestError) => {
        if ((error as RequestError).status) {
          console.log("error status", (error as RequestError).status, error as RequestError)
        }
      })
      .finally(() => {
        setState(prev => ({ ...prev, loading: false }))
      })
  }, props.options?.throttle ?? 3000)

  const execute = useCallback(throttleExecute, [props.url])

  return [state, execute]
}
// export default function useOctokitApi<T>(props: OctokitApiProps): OctokitApiResponse<T> {
//   const [state, setState] = useState<OctokitApiState<T>>({
//     error: null,
//     loading: false,
//     data: null,
//   })
//
//   const prevParams = usePrevious(props.params)
//   const execute = useCallback(() => {
//     if (JSON.stringify(prevParams) === JSON.stringify(props.params)) return
//     return throttle(() => {
//       octokit
//         .request(props.url, props.params)
//         .then(response => {
//           if (response.status === 200) {
//             setState(prev => ({ ...prev, data: response.data }))
//           }
//         })
//         .catch((error: RequestError) => {
//           if ((error as RequestError).status) {
//             console.log("error status", (error as RequestError).status, error as RequestError)
//           }
//         })
//         .finally(() => {
//           setState(prev => ({ ...prev, loading: false }))
//         })
//     }, props.options?.throttle ?? 3000)
//   }, [props.url, props.params])
//
//   return [state, execute]
// }
