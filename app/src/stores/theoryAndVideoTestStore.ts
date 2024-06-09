import {defineStore} from 'pinia';
import useNotificationMessage from "src/composables/notificationMessage";
import {api} from "boot/axios";
import useDownloadExcel from "src/composables/downloadExcelApi";
import {useCurrentDate} from "src/utils/dateHook";
import {
  Question,
  QuestionAnswer,
  StoreTestRequest,
  TheoryTest,
  Url,
  VideoTest,
  VideoTestAnswers
} from "src/interfaces/tests";

export const useTheoryAndVideoTestStore = defineStore('theoryAndVideoTestStore', {
  state: () => ({
    theoryTest: [] as TheoryTest[],
    activeTestExist: false as boolean,
    activeTest: {} as TheoryTest,
    videoTests: [] as VideoTest[],
    videoTest: {} as VideoTest,
    activeVideoTestExist: false as boolean,
    activeVideoTest: {} as any,

  }),
  getters: {
    getTheoryTest: (state) => state.theoryTest,
    getVideoTests: (state) => state.videoTests,
    getVideoTest: (state) => state.videoTest,
    getActiveTest: (state) => state.activeTest,
    getActiveVideoTest: (state) => state.activeVideoTest

  },
  actions: {

    async storeTheoryTest(request: StoreTestRequest) {

      await api
        .post('/theory-test/', request)
        .then((response)=>{
          this.theoryTest.unshift(response.data);
          useNotificationMessage('success','Uspešno kreiran test!')
        })

    },

    async getTheoryTestApi(){
      await api
        .get('/theory-test/')
        .then((response)=>{
          this.theoryTest = response.data;
        })
    },

    async deleteTest(id: string){
      await api
        .delete('/theory-test/'+id)
        .then(()=>{
          const index = this.theoryTest.findIndex(el => el.id === id);
          if(index !== -1){
            this.theoryTest.splice(index,1)
          }
          useNotificationMessage('success','Uspešno obrisan test!')
        })
    },

    async showTest(id: string){
      let test = {
        name: '',
        start_date: '',
        end_date: '',
        league: [''],
        role: [''],
        theory_questions: [  {
          question_text: '',
          answers: [
            {answer_text: '',is_correct: false},
          ],
        }]
      };
      await api
        .get('/theory-test/'+id)
        .then((response: {data: TheoryTest})=>{
          test = response.data;
        })
      return test
    },

    async updateTheoryTest(id: string, request: StoreTestRequest){
      await api
        .patch('/theory-test/'+id, request)
        .then(()=>{
          useNotificationMessage('success','Uspešno ažuriran test!')
        })
    },

    async getActiveTestApi(){
      try {
        const response = await api.get('/theory-test/get-active-theory-test');
        this.activeTest = response.data;
        this.activeTest.theory_questions.forEach((el: Question) => {
            el.answers = el.answers.map((answer: QuestionAnswer) => {
              return {
                answer_text: answer.answer_text,
                is_correct: false
              }
            })
        })
        this.activeTestExist = true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Greška prilikom dobijanja aktivnog testa:', error);
        } else {
          this.activeTestExist = false;
        }
      }
    },

    async getActiveVideoTestApi(){
      const date = new Date();
      const currentTime = useCurrentDate() + ' ' + date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds();
      console.log(currentTime)
      try {
        const response = await api.get('/video-test/get-active-video-test');
        this.activeVideoTest = response.data;
        this.activeVideoTest['questions'] = this.activeVideoTest.answers.map((el:VideoTestAnswers) => {
          return {
            video: this.activeVideoTest.urls.find((el2: Url) => el.order_id === el2.order_id).path,
            order_id: el.order_id,
            answers: el.answers.map((answer: QuestionAnswer) => {
              return {
                answer_text: answer.answer_text,
                is_correct: false
              }
            })
          }
        })

        this.activeVideoTest.questions.sort(this.sortByOrderId)

        this.activeVideoTestExist = true;
      }catch (error: any) {
        if (error.response && error.response.status === 404) {
          this.activeVideoTestExist = false;
        } else {
          console.error('Greška prilikom dobijanja aktivnog testa:', error);
        }
      }
    },

     sortByOrderId(a: VideoTestAnswers, b: VideoTestAnswers) {
        return a.order_id - b.order_id;
    },
    async submitTest(answers: { answer: string }[]) {

      const request = {
        test_id: this.activeTest.id,
        answers
      }
      try {
        const response = await api.post('/theory-test/submit-theory-test', request);
        useNotificationMessage('success', response.data.message)
        this.activeTestExist = false;
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          useNotificationMessage('error',error.response.data.detail)
        }
      }

    },
    async submitVideoTest(answers: { answer: string }[]) {

      const request = {
        test_id: this.activeVideoTest.id,
        answers
      }
      try {
        const response = await api.post('/video-test/submit-video-test', request);
        useNotificationMessage('success', response.data.message)
        this.activeVideoTestExist = false;
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          useNotificationMessage('error',error.response.data.detail)
        }
      }

    },

    async downloadExcel(id: string){

      try {
        const url ='/theory-test/export-results/'+id;
        await useDownloadExcel(url, {}, 'rezultati');

      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          useNotificationMessage('error','Nema rezultata za ovaj video test!')
        }
      }
    },

    async downloadExcelVideoTest(id: string){
      try {
        const url ='/video-test/export-results/'+id;
        await useDownloadExcel(url, {}, 'rezultati-video-test');

      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          useNotificationMessage('error','Nema rezultata za ovaj video test!')
        }
      }
    },

    async getVideoTestApi(){
      await api
        .get('/video-test/')
        .then((response)=>{
          this.videoTests = response.data;
        })
    },

    async storeVideoTest(request: any) {

      await api
        .post('/video-test/', request)
        .then((response)=>{
          this.videoTests.unshift(response.data);
          useNotificationMessage('success','Uspešno kreiran test!')
        })

    },
    async updateVideoTest(id: number | string, request: any){
      await api
        .patch('/video-test/'+id, request)
        .then((response)=>{
          const index = this.videoTests.findIndex(el => el.id === id);
          if(index != -1){
            this.videoTests[index] = response.data;
          }
          useNotificationMessage('success','Uspešno ažuriran test!')
        })
    },

    async deleteVideoTest(id: string){
      await api
        .delete('/video-test/'+id)
        .then(()=>{
          const index = this.videoTests.findIndex(el => el.id === id);
          if(index !== -1){
            this.videoTests.splice(index,1)
          }
          useNotificationMessage('success','Uspešno obrisan test!')
        })
    },

    async uploadVideo(request: FormData, videoTestId: number | string, orderId: number, mode: 'store' | 'update') {

      await api
        .post('/video-test/upload-video/' + videoTestId + '/' + orderId, request)
        .then((response)=>{
          if(mode === 'store'){
            this.videoTest.urls.push(response.data)
          }else if(mode === 'update'){
           const index = this.videoTest.urls.findIndex(el => el.order_id === orderId);
           if(index != -1){
             this.videoTest.urls[index] =  response.data
           }
          }
          useNotificationMessage('success','Uspešno sačuvano pitanje!')
        })

    },
    async addAnswers(request: {answer_text: string, is_correct: boolean}[], videoTestId: number | string, orderId: number, mode: 'store' | 'update') {

      await api
        .post('/video-test/add-answers/' + videoTestId + '/' + orderId, request)
        .then((response)=>{
          if(mode === 'store'){
            this.videoTest.answers.push(response.data)
          }else if(mode === 'update'){
            const index = this.videoTest.answers.findIndex(el => el.order_id === orderId);
            if(index != -1){
              this.videoTest.answers[index] =  response.data
            }
          }
          useNotificationMessage('success','Uspešno sačuvano pitanje!')
        })

    },
    async showVideoTest(id: string){
      await api
        .get('/video-test/'+id)
        .then((response)=>{
          this.videoTest = response.data;
        })
    }
  }
})
