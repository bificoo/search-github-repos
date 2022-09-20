import React, { useCallback, useState, useRef, useEffect, useMemo } from "react"
import Form from "components/Form"
import AutoSizer from "components/AutoSizer"
import VirtualScroller from "components/VirtualScroller"
import { Endpoints } from "@octokit/types"
import Repository from "pages/RepositoryList/Repository"
import useThrottle from "hooks/useThrottle"
import { fetchRepositories } from "./utils"
import styled from "./RepositoryList.module.scss"
import useInView from "hooks/useInView"

export type searchRepositoriesReposResponse = Endpoints["GET /search/repositories"]["response"]
export type searchRepository = Common.ArrayElement<searchRepositoriesReposResponse["data"]["items"]>

const RepositoryList = () => {
  const [value, setValue] = useState<string>("")
  const [repositories, setRepositories] = useState<searchRepository[]>([])
  const [loading, setLoading] = useState(false)
  const responseRef = useRef<searchRepositoriesReposResponse | null>(null)
  const lastRepositoryIdRef = useRef<string | null>(null)
  const searchValueRef = useRef<string>(value)
  const pageRef = useRef<number>(1)

  const { ref, inView } = useInView<HTMLAnchorElement>({})
  const throttledValue = useThrottle<string>(value)

  const fetch = useCallback(async (page = 1) => {
    if (!searchValueRef.current) return
    setLoading(true)
    page === 1 && setRepositories([])
    const fetchRepositoriesResponse = await fetchRepositories(searchValueRef.current, page)
    if (fetchRepositoriesResponse.data.items.length > 0) {
      pageRef.current = page
      responseRef.current = fetchRepositoriesResponse
      lastRepositoryIdRef.current =
        responseRef.current.data.items[responseRef.current.data.items.length - 1].node_id
      if (page === 1) {
        setRepositories(fetchRepositoriesResponse.data.items)
      } else {
        setRepositories(prev => [...prev, ...fetchRepositoriesResponse.data.items])
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    searchValueRef.current = throttledValue
    fetch(1)
  }, [fetch, throttledValue])

  useEffect(() => {
    if (inView) {
      fetch(pageRef.current + 1)
    }
  }, [fetch, inView])

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
            onChange={event => setValue(event.target.value)}
          />
        </div>

        {throttledValue !== "" && (
          <AutoSizer>
            {({ height }) => (
              <VirtualScroller
                data={repositories}
                height={115}
                viewportHeight={height}
                renderItem={repository => (
                  <Repository
                    key={repository.node_id}
                    data={repository}
                    {...(repository.node_id === lastRepositoryIdRef.current ? { ref } : {})}
                  />
                )}
                renderLoading={() => loading && <div className={styled.loading}>Loading</div>}
              />
            )}
          </AutoSizer>
        )}
      </section>
    </div>
  )
}

export default RepositoryList
