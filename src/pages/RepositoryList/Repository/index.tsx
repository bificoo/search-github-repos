import { day } from "utils"
import React from "react"
import { searchRepository } from "pages/RepositoryList"
import styled from "./Repository.module.scss"

type RepositoryProps = {
  data: searchRepository
  onVisible?: (id: number) => void
}

const Repository = React.forwardRef(function Repository(
  props: RepositoryProps,
  ref: React.Ref<HTMLAnchorElement>,
) {
  return (
    <a ref={ref} href={props.data.html_url} title={props.data.full_name} className={styled.wrapper}>
      <div>
        <div className={styled.title}>{props.data.full_name}</div>
        <div className={styled.description}>{props.data.description}</div>
        <div className={styled.footer}>
          {props.data.language}
          {props.data.language && "・"}
          {day(props.data.pushed_at).fromNow()}
        </div>
      </div>
    </a>
  )
})

export default Repository
