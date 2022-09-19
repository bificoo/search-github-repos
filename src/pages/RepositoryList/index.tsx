import React, { useCallback, useEffect, useState, useRef } from "react"
import Form from "components/Form"
import { Endpoints } from "@octokit/types"
import Repository from "pages/RepositoryList/Repository"
import styled from "./RepositoryList.module.scss"
import { fetchRepositories } from "./utils"

export type searchRepositoriesReposResponse = Endpoints["GET /search/repositories"]["response"]
export type searchRepository = Common.ArrayElement<searchRepositoriesReposResponse["data"]["items"]>

const RepositoryList = () => {
  const [repositories, setRepositories] = useState<searchRepository[]>([])
  const response = useRef<searchRepositoriesReposResponse | null>(null)
  const lastRepositoryId = useRef<number | null>(null)
  const searchText = useRef<string>("peggy")
  const page = useRef<number>(1)

  const fetch = useCallback(async (page = 1) => {
    const fetchRepositoriesResponse = await fetchRepositories(searchText.current, page)
    if (fetchRepositoriesResponse.data.items.length > 0) {
      console.info("fetchRepositoriesResponse.data.items", fetchRepositoriesResponse.data.items)
      response.current = fetchRepositoriesResponse
      lastRepositoryId.current =
        response.current.data.items[response.current.data.items.length - 1].id
      if (page === 1) {
        setRepositories(fetchRepositoriesResponse.data.items)
      } else {
        setRepositories(prev => [...prev, ...fetchRepositoriesResponse.data.items])
      }
    }
  }, [])

  const handleVisible = (id: number) => {
    if (id !== lastRepositoryId.current) return
    page.current = page.current + 1
    fetch(page.current)
  }

  // Initialize first page
  useEffect(() => {
    fetch(1)
  }, [fetch])

  // Change input value
  useEffect(() => {
    // console.info("input value change")
    // fetch(1)
  }, [])

  return (
    <div className={styled.wrapper}>
      <header className={styled.header}>
        <h1>Search Github Repositories</h1>
      </header>
      <section className={styled.inner}>
        <div className={styled.filter}>
          <Form.Input style={{ width: "100%" }} />
        </div>
        <div>
          {repositories.map(repository => (
            <Repository key={repository.id} data={repository} onVisible={handleVisible} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default RepositoryList
