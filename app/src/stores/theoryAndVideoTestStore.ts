import {defineStore} from 'pinia';
import useNotificationMessage from "src/composables/notificationMessage";
import {api} from "boot/axios";

export const useTheoryAndVideoTestStore = defineStore('theoryAndVideoTestStore', {
  state: () => ({
    theoryTest: [] as any[],
    videTest: [] as any[],

  }),
  getters: {
    getTheoryTest: (state) => state.theoryTest,
    getVideoTest: (state) => state.videTest
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
        .then((response)=>{
          useNotificationMessage('success','Uspešno ažuriran test!')
        })
    }
  }
})
