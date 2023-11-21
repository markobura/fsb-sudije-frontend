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

    async getUserList(accountState: number) {

      const {data: {users}} = await useFetch<UsersResponse, null, { accountState: number }>({
        url: '/administration/users/index',
        method: HttpMethod.GET,
        params: {accountState}
      });
      this.users = users;
    },

    async storeNewUser(request: StoreNewUserRequest) {
      const {message, data: {user}} = await useFetch<StoreNewUserResponse, StoreNewUserRequest>({
        url: '/administration/users/store',
        method: HttpMethod.POST,
        data: request
      });
      this.users.unshift(user)
      useNotificationMessage(NotificationType.SUCCESS, message);
    },
    async showUserDetails(userId: number) {
      const {data: {user}} = await useFetch<UserDetailsResponse>({
        url: `/administration/users/${userId}/show`,
        method: HttpMethod.GET,
      })
      this.userDetails = user
    },
    async updateUser(userId: number, request: StoreNewUserRequest){
      const {message, data: {user}} = await useFetch<StoreNewUserResponse, StoreNewUserRequest>({
        url: `/administration/users/${userId}/update`,
        method: HttpMethod.PATCH,
        data: request
      })
      this.userDetails = user

      useNotificationMessage(NotificationType.SUCCESS, message);
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
