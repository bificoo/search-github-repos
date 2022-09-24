import React, { useCallback, useState, useRef, useEffect } from "react"
import Form from "components/Form"
import AutoSizer from "components/AutoSizer"
import VirtualScroller from "components/VirtualScroller"
import Repository from "pages/RepositoryList/Repository"
import styled from "./RepositoryList.module.scss"
import useInView from "hooks/useInView"
import useOctokitApi from "hooks/useOctokitApi"
import { Endpoints } from "@octokit/types"

export type searchRepositoriesResponse = Endpoints["GET /search/repositories"]["response"]
export type searchRepositoriesData = Endpoints["GET /search/repositories"]["response"]["data"]

export type searchRepository = Common.ArrayElement<searchRepositoriesResponse["data"]["items"]>
type Params = {
  q: string
  sort: "stars"
  order: "desc"
  per_page: number
  page: number
}
const RepositoryList = () => {
  const [query, setQuery] = useState<string>("")
  const [repositories, setRepositories] = useState<searchRepository[]>([])
  const lastRepositoryIdRef = useRef<string | null>(null)
  const pageRef = useRef<number>(1)

  const { ref, inView } = useInView<HTMLAnchorElement>({})
  const [repositoriesResponse, fetchRepositories] = useOctokitApi<searchRepositoriesData>({
    url: "GET /search/repositories",
    options: {
      debounce: 300,
    },
  })

  const executeApi = useCallback(
    (page: number) => {
      if (page === 1 && repositories.length !== 0) setRepositories([])
      pageRef.current = page
      fetchRepositories({
        q: query,
        sort: "stars",
        order: "desc",
        per_page: 10,
        page: pageRef.current,
      })
    },
    [fetchRepositories, query],
  )

  // search new word
  useEffect(() => {
    if (!query) return
    executeApi(1)
  }, [query, executeApi])

  // search next page
  useEffect(() => {
    if (inView) executeApi(pageRef.current + 1)
  }, [inView, executeApi])

  // update ui view
  useEffect(() => {
    if (repositoriesResponse.loading) return
    if (repositoriesResponse.data?.items.length) {
      pageRef.current = (repositoriesResponse.params as Params).page
      lastRepositoryIdRef.current =
        repositoriesResponse.data.items[repositoriesResponse.data.items.length - 1].node_id ?? null
      if (pageRef.current === 1) {
        setRepositories(repositoriesResponse.data.items)
      } else {
        setRepositories(prev => [...prev, ...(repositoriesResponse.data?.items || [])])
      }
    } else {
      setRepositories([])
    }
  }, [repositoriesResponse])

  return (
    <div className={styled.wrapper}>
      <header className={styled.header}>
        <h1>Search Github Repositories</h1>
      </header>
      <section className={styled.inner}>
        <div className={styled.filter}>
          <Form.Input
            autoFocus
            style={{ width: "100%" }}
            placeholder="Please enter your search text."
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        {query !== "" && (
          <AutoSizer>
            {({ height }) => (
              <VirtualScroller
                data={repositories}
                loading={repositoriesResponse.loading}
                height={115}
                viewportHeight={height}
                renderItem={repository => (
                  <Repository
                    key={repository.node_id}
                    data={repository}
                    {...(repository.node_id === lastRepositoryIdRef.current ? { ref } : {})}
                  />
                )}
                renderLoading={(ref: React.RefCallback<HTMLDivElement>, { visible }) => (
                  <div
                    ref={ref}
                    className={styled.message}
                    style={{ visibility: visible ? "visible" : "hidden" }}>
                    Loading
                  </div>
                )}
              />
            )}
          </AutoSizer>
        )}
      </section>
    </div>
  )
}

export default RepositoryList
