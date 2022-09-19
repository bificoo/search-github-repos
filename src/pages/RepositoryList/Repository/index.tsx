import { day } from "utils"
import React, { useEffect } from "react"
import { searchRepository } from "pages/RepositoryList"
import useElementOnScreen from "hooks/useElementOnScreen"
import usePrevious from "hooks/usePrevious"
import styled from "./Repository.module.scss"

type RepositoryProps = {
  data: searchRepository
  onVisible?: (id: number) => void
}

const Repository = ({ data, ...props }: RepositoryProps) => {
  const { node, entry } = useElementOnScreen<HTMLAnchorElement>({ threshold: 0.25 })

  const prevIsVisible = usePrevious(entry?.isIntersecting)
  useEffect(() => {
    if (prevIsVisible === entry?.isIntersecting) return
    if (entry?.isIntersecting) {
      props.onVisible && props.onVisible(data.id)
    }
  }, [entry?.isIntersecting, props.onVisible, data.id])

  return (
    <a ref={node} href={data.html_url} title={data.full_name} className={styled.wrapper}>
      <div>
        <div className={styled.title}>{data.full_name}</div>
        <div className={styled.description}>{data.description}</div>
        <div className={styled.footer}>
          {data.language}・{day(data.pushed_at).fromNow()}
        </div>
      </div>
    </a>
  )
}

export default Repository
