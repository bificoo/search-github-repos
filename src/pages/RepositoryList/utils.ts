import { searchRepositoriesReposResponse } from "./index"
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  accept: "application/vnd.github+json",
  auth: "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",
})

export function fetchRepositories(searchText: string, page: number) {
  console.info(searchText, page)
  const promise = new Promise<searchRepositoriesReposResponse>((resolve, reject) => {
    if (searchText === "") reject("Search text can't empty.")
    octokit
      .request("GET /search/repositories", {
        q: searchText,
        sort: "stars",
        order: "desc",
        per_page: 10,
        page,
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
  return promise
}
