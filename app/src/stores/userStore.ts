import {defineStore} from 'pinia';
import {
  User,
} from 'src/interfaces/user';
import useNotificationMessage from "src/composables/notificationMessage";
import {api} from "boot/axios";

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userDetails: {} as User,
    users: [] as User[],

  }),
  getters: {
    getUsers: (state) => state.users,
    getUserDetails: (state) => state.userDetails
  },
  actions: {


    async getUserList() {
      await api
        .get('/user', )
        .then((response) => {
          this.users = response.data;
        })
    },

    async storeNewUser(request: any) {

      await api
        .post('/user/', request)
        .then((response)=>{
          this.users.unshift(response.data);
          useNotificationMessage('success','Uspešno kreiran korisnik!')
        })

    },
    async updateUser(request: any){
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
          console.log(response)
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


}
})
