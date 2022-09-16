import React, { useEffect, useState } from "react"
import Form from "components/Form"
import { Octokit } from "@octokit/rest"
import { Endpoints } from "@octokit/types"
import { day } from "utils"
import styled from "./RepoList.module.scss"

const octokit = new Octokit({
  auth: "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",
})

type searchRepositoriesReposResponse = Endpoints["GET /search/repositories"]["response"]

const RepoList = () => {
  const [searchText, setSearchText] = useState("tetris")
  const [repositories, setRepositories] = useState<
    searchRepositoriesReposResponse["data"]["items"]
  >([])

  useEffect(() => {
    if (searchText === "") return
    console.info("searchText", searchText)
    ;(async () => {
      try {
        const {
          data: { items },
        } = await octokit.request("GET /search/repositories", {
          q: `${searchText}+language:assembly&sort=stars&order=desc&page=1`,
        })

        setRepositories(items)
      } catch (error) {
        console.error(error)
        // TODO: POPUP ERROR MODAL.
      }
    })()
  }, [searchText])

  return (
    <div className={styled.wrapper}>
      <header className={styled.header}>
        <h1>Search Github Repositories</h1>
      </header>
      <section className={styled.inner}>
        <div className={styled.filter}>
          <Form.Input style={{ width: "300px" }} />
        </div>
        <div>
          {repositories.map(repository => {
            console.info(repository)
            return (
              <a
                key={repository.id}
                href={repository.html_url}
                title={repository.full_name}
                className={styled.repository}>
                <div>
                  <div className={styled.title}>{repository.full_name}</div>
                  <div className={styled.description}>{repository.description}</div>
                  <div className={styled.footer}>
                    {repository.language}・{day(repository.pushed_at).fromNow()}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default RepoList
