"use client"
import React from 'react'


type Props = {
  children: React.ReactNode
}
const ExamLayout = ({children}: Props) => {
  return (
    <div>{children}</div>
  )
}

export default ExamLayout