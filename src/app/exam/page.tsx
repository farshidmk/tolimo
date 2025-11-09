"use client"

import { useExamStore } from '@/hooks/useExamStore';
import React from 'react'


const ExamPage = () => {
  const {examInfo} = useExamStore((state) => ({examInfo :state.examInfo}));
  return (
    <div>
      {JSON.stringify(examInfo)}
    </div>
  )
}

export default ExamPage