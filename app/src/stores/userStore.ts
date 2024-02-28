import {defineStore} from 'pinia';
import {
  ResendActivationEmailResponse,
  StoreNewUserRequest,
  StoreNewUserResponse,
  User,
  UserDetailsResponse,
  UsersResponse
} from 'src/interfaces/user';
import {HttpMethod, useFetch} from "src/composables/fetch";
import useNotificationMessage, {NotificationType} from "src/composables/notificationMessage";
import {api} from "boot/axios";
import {an} from "vitest/dist/reporters-5f784f42";

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

    // async getUserList(accountState: number) {
    //
    //   const {data: {users}} = await useFetch<UsersResponse, null, { accountState: number }>({
    //     url: '/user',
    //     method: HttpMethod.GET,
    //     params: {accountState}
    //   });
    //   this.users = users;
    // },
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
        .patch('/user/', request)
        .then((response)=>{
          const index = this.users.findIndex(el => el._id === request._id);
          if(index !== -1){
            this.users[index] = response.data;
          }
          useNotificationMessage('success','Uspešno ažuriran korisnik!')
        })
    },

    async changePassword(changePasswordRequest: {_id: string, new_password: string}){
      const url = `/user/change-user-password?user_id=${changePasswordRequest._id}&new_password=${changePasswordRequest.new_password}`
      await api
        .patch(url)
        .then((response)=>{
          console.log(response)
          useNotificationMessage('success','Uspešno promenjena lozinka!')
        })
    },

    async deleteUser(id: string){
      await api
        .delete('/user/'+id)
        .then(()=>{
          const index = this.users.findIndex(el => el._id === id);
          if(index !== -1){
            this.users.splice(index,1)
          }
          useNotificationMessage('success','Uspešno obrisan korisnik!')
        })
    },
    async setAccountState(userId: number){
      const {message, data: {user}} = await useFetch<StoreNewUserResponse>({
        url: `/administration/users/set-status/${userId}`,
        method: HttpMethod.PATCH
      })
      useNotificationMessage(NotificationType.SUCCESS, message);

      this.userDetails = user
    },

    async sendActivationEmail(userId: number){

      const {message} = await useFetch<ResendActivationEmailResponse>({
        url: `/administration/users/resend-activation-email/${userId}`,
        method: HttpMethod.POST,
      })
      useNotificationMessage(NotificationType.SUCCESS, message);
    }
  }
})
