import {useDBFormat} from "src/utils/dateHook";

export interface TheoryTest {
  id: string,
  name: string,
  start_date: string,
  end_date: string,
  league: string[],
  role: string[],
  theory_questions: Question[]
}
export interface StoreTestRequest {
  name: string,
  start_date: string,
  end_date: string,
  league: string[],
  role: string[],
  theory_questions: Question[]
}

export interface Question{
  question_text: string,
  answers: QuestionAnswer[]
}
export interface QuestionAnswer{
  answer_text: string,is_correct: boolean
}


export interface VideoTest {
  id: string,
  name: string,
  start_date: string,
  end_date: string,
  league: string[],
  role: string[],
  urls: Url[],
  answers: VideoTestAnswers[]
}

export interface Url{
  id	: string
  path	: string
  order_id	: number
  video_test_id : string
}

export interface VideoTestAnswers{
  path	: string
  order_id	: number
  video_test_id : string
  answers: QuestionAnswer[]
}
