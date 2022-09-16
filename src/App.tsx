import React from "react"
import RepoList from "pages/RepoList"
import styled from "./App.module.scss"

function App() {
  return (
    <div className={styled.wrapper}>
      <RepoList />
    </div>
  )
}

export default App
