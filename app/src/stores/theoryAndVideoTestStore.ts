import {defineStore} from 'pinia';
import useNotificationMessage from "src/composables/notificationMessage";
import {api} from "boot/axios";

export const useTheoryAndVideoTestStore = defineStore('theoryAndVideoTestStore', {
  state: () => ({
    theoryTest: [] as any[],
    activeTestExist: false,
    activeTest: {} as any,
    videTest: [] as any[],

  }),
  getters: {
    getTheoryTest: (state) => state.theoryTest,
    getVideoTest: (state) => state.videTest,
    getActiveTest: (state) => state.activeTest
  },
  actions: {

    async storeTheoryTest(request: any) {

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
      let test = null;
      await api
        .get('/theory-test/'+id)
        .then((response)=>{
          test = response.data;
        })
      return test
    },

    async updateTheoryTest(id: string, request: any){
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
        this.activeTest.theory_questions.forEach(el => {
            el.answers = el.answers.map(answer => {
              return {
                answer_text: answer.answer_text,
                is_correct: false
              }
            })
        })
        this.activeTestExist = true;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Test nije pronađen.');
          this.activeTestExist = false;
        } else {
          console.error('Greška prilikom dobijanja aktivnog testa:', error);
        }
      }

    },

    async submitTest(answers: { answer: string }[]) {

      const request = {
        theory_test_id: this.activeTest.id,
        answers
      }
      try {
        const response = await api.post('/theory-test/submit-theory-test', request);
        useNotificationMessage('success', response.data.message)
      } catch (error) {
        if (error.response && error.response.status === 409) {
          useNotificationMessage('error',error.response.data.detail)
        }
      }

    }
  }
})
