export type Exam = {
        "sections": ExamSection[],
        "examTitle": string,
        "defaultDuration":string, // sample "03:30:00",
        "bookletName": string,
        "testType": number,
        "bookletCode": string, //sample "B01",
        "examId": string,
        "accommodation": number,
        "alignment": number,
        "description": string
        "isEncrypted": boolean,
        "sign": null
    
}


export type ExamSection = {
    "sectiontId": string,
    "bookletCode": string,
    "title": string,
    "sectionType": number,
    "displayOrder": number,
    "sectionDuration": string //"00:10:00",
    "isForcedToAnswer": boolean,
    "areAnswersEditable": true,
    "minRequiredAnswers": 0,
    "maxAllowedAnswers": 30,
    "questions": [],
    "formObjects": SectionFormObject[],
    "isEncrypted": false,
    "sign": null
    isRunning: boolean
    timeLeft: number
}


export type SectionFormObject = {
    "state": number,
    "label": string,
    "formObjectType": number,
    "isEncrypted": boolean,
    "sign": unknown
}