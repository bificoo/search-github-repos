import { day } from "utils"
import React, { useEffect } from "react"
import { searchRepository } from "pages/RepositoryList"
import useInView from "hooks/useInView"
import styled from "./Repository.module.scss"

type RepositoryProps = {
  data: searchRepository
  onVisible?: (id: number) => void
}

const Repository = ({ data, ...props }: RepositoryProps) => {
  const { ref, inView } = useInView<HTMLAnchorElement>({ threshold: 0.25 })

  useEffect(() => {
    inView && props.onVisible && props.onVisible(data.id)
  }, [inView, props.onVisible, data.id])

  return (
    <a ref={ref} href={data.html_url} title={data.full_name} className={styled.wrapper}>
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
