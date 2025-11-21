import { useExamStore } from '@/hooks/useExamStore';
import React from 'react'



const SingleChoiceQuestion = () => {
    
      const { activeQuestion } = useExamStore();
  return (
    <div>SingleChoiceQuestion</div>
  )
}

export default SingleChoiceQuestion