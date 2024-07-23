import {defineStore} from 'pinia';
import {
  StoreRequest,
  User,
} from 'src/interfaces/user';
import useNotificationMessage from "src/composables/notificationMessage";
import {api} from "boot/axios";
import useDownloadExcel from "src/composables/downloadExcelApi";
import {useCurrentDate} from "src/utils/dateHook";

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userDetails: {} as User,
    users: [] as User[],
    userUnavailability: [] as {id: string, user_id: string, date: string, start_time: string, end_time: string, reason: string}[],
    // availabilities: [] as any[]
  }),
  getters: {
    getUsers: (state) => state.users,
    getUserDetails: (state) => state.userDetails,
    getUserUnavailability: (state) => state.userUnavailability,
    // getAvailabilities: (state) => state.availabilities
  },
  actions: {


    async getUserList() {
      await api
        .get('/user/', )
        .then((response) => {
          this.users = response.data;
        })
    },

    async storeNewUser(request: StoreRequest) {

      await api
        .post('/user/', request)
        .then((response)=>{
          if(request.role === 'USER'){
            this.users.unshift(response.data);
          }
          useNotificationMessage('success','Uspešno kreiran korisnik!')
        })

    },
    async updateUser(request: StoreRequest){
      await api
        .patch('/user/'+request.id, request)
        .then((response)=>{
          const index = this.users.findIndex(el => el.id === request.id);
          if(index !== -1){
            this.users[index] = response.data;
          }
          useNotificationMessage('success','Uspešno ažuriran korisnik!')
        })
    },

    async changePassword(changePasswordRequest: {user_id: string, new_password: string}){
      await api
        .patch('/user/change-user-password',changePasswordRequest)
        .then((response)=>{
          useNotificationMessage('success','Uspešno promenjena lozinka!')
        })
    },

    async deleteUser(id: string){
      await api
        .delete('/user/'+id)
        .then(()=>{
          const index = this.users.findIndex(el => el.id === id);
          if(index !== -1){
            this.users.splice(index,1)
          }
          useNotificationMessage('success','Uspešno obrisan korisnik!')
        })
    },

    async addUnavailability(request: any){
      await api
        .post('/unavailability/', request)
        .then((response)=>{
          console.log(response.data)
          this.userUnavailability.push(...response.data);
          this.userUnavailability.sort((a, b) => new Date(a.date) - new Date(b.date))
          useNotificationMessage('success','Uspešno dodata nedostupnost!')
        })
    },

    async getUserUnavailabilitiesApi(){
      await api
        .get('/unavailability/', )
        .then((response) => {
          this.userUnavailability = response.data;
        })
    },

    async deleteAvailability(id: string){
      await api
        .delete('/unavailability/'+id)
        .then(()=>{
          const index = this.userUnavailability.findIndex(el => el.id === id);
          if(index !== -1){
            this.userUnavailability.splice(index,1)
          }
          useNotificationMessage('success','Uspešno obrisana dostupnost!')
        })
    },

    async downloadUnavailabilityExcel(){
      try {
        const url ='/unavailability/export-unavailabilities'
        await useDownloadExcel(url, {}, 'nedostupnosti - ' + useCurrentDate());

      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          useNotificationMessage('error','Nema rezultata!')
        }
      }
    }
    // async getAvailabilitiesApi(){
    //   await api
    //     .get('/availabilities', )
    //     .then(() => {
    //       this.availabilities = response.data;
    //     })
    // }


}
})
