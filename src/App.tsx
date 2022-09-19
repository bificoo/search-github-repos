import React from "react"
import RepositoryList from "pages/RepositoryList"
import styled from "./App.module.scss"

function App() {
  return (
    <div className={styled.wrapper}>
      <RepositoryList />
    </div>
  )
}

export default App
