import React, { useCallback, useState, useRef, useEffect, useMemo } from "react"
import Form from "components/Form"
import AutoSizer from "components/AutoSizer"
import VirtualScroller from "components/VirtualScroller"
import InfiniteScroller from "components/InfiniteScroller"
import { Endpoints } from "@octokit/types"
import Repository from "pages/RepositoryList/Repository"
import useThrottle from "hooks/useThrottle"
import { fetchRepositories } from "./utils"
import styled from "./RepositoryList.module.scss"

export type searchRepositoriesReposResponse = Endpoints["GET /search/repositories"]["response"]
export type searchRepository = Common.ArrayElement<searchRepositoriesReposResponse["data"]["items"]>

const RepositoryList = () => {
  const [value, setValue] = useState<string>("")
  const [repositories, setRepositories] = useState<searchRepository[]>([])
  const responseRef = useRef<searchRepositoriesReposResponse | null>(null)
  const lastRepositoryIdRef = useRef<number | null>(null)
  const searchValueRef = useRef<string>(value)
  const pageRef = useRef<number>(1)
  const throttledValue = useThrottle<string>(value)

  const fetch = useCallback(async (page = 1) => {
    if (!searchValueRef.current) return
    const fetchRepositoriesResponse = await fetchRepositories(searchValueRef.current, page)
    if (fetchRepositoriesResponse.data.items.length > 0) {
      console.info("fetch:", searchValueRef.current, page, fetchRepositoriesResponse.data.items)
      pageRef.current = page
      responseRef.current = fetchRepositoriesResponse
      lastRepositoryIdRef.current =
        responseRef.current.data.items[responseRef.current.data.items.length - 1].id
      if (page === 1) {
        setRepositories(fetchRepositoriesResponse.data.items)
      } else {
        setRepositories(prev => [...prev, ...fetchRepositoriesResponse.data.items])
      }
    }
  }, [])

  // const handleVisible = (id: number) => {
  //   if (id !== lastRepositoryIdRef.current) return
  //   fetch(pageRef.current + 1)
  // }

  // const handleLastInView = () => {
  //   console.info("last")
  //   fetch(pageRef.current + 1)
  // }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    searchValueRef.current = throttledValue
    fetch(1)
  }, [throttledValue])

  return (
    <div className={styled.wrapper}>
      <header className={styled.header}>
        <h1>Search Github Repositories</h1>
      </header>
      <section className={styled.inner}>
        <div className={styled.filter}>
          <Form.Input style={{ width: "100%" }} onChange={handleChange} />
        </div>

        {repositories.length > 0 && (
          <AutoSizer>
            {({ height }) => (
              <VirtualScroller
                data={repositories}
                height={115}
                viewportHeight={height}
                renderItem={repository => <Repository key={repository.id} data={repository} />}
              />
            )}
          </AutoSizer>
        )}

        {/* <InfiniteScroller domList={repositoriesDom} onLastInView={handleLastInView} /> */}

        {throttledValue === "" && (
          <div className={styled["not-enter"]}>Please enter your search text above.</div>
        )}
        {throttledValue !== "" && repositories.length === 0 && (
          <div className={styled["no-data"]}>No Data</div>
        )}
      </section>
    </div>
  )
}

export default RepositoryList
