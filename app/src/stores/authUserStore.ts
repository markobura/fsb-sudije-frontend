import {defineStore} from 'pinia';
import {User} from "src/interfaces/user";
import useNotificationMessage from "src/composables/notificationMessage";
import {Cookies} from "quasar";
import {api} from "boot/axios";

export const useAuthenticatedUserStore = defineStore('authenticatedUserStore', {
  state: () => ({
    user: {} as User,
    token: '',
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {

    async login(request: {username: string, password: string}){
      const formData = new FormData();
      formData.append('username', request.username);
      formData.append('password', request.password);

      await api
        .post('/auth/token/', formData)
        .then((response)=>{
          console.log(response)
          this.setUserData(response.data.user);
          this.token = response.data.access_token;
          this.setUserCookie(response.data.access_token, response.data.user.email);
          useNotificationMessage('success','Uspešan pristup sistemu!')
        })

    },

    async changePassword(changePasswordRequest: {old_password: string, new_password: string}){
      const formData = new FormData();
      formData.append('old_password', changePasswordRequest.old_password);
      formData.append('new_password', changePasswordRequest.new_password);
      const url = `/user/change-password?old_password=${changePasswordRequest.old_password}&new_password=${changePasswordRequest.new_password}/`
      await api
        .patch(url)
        .then((response)=>{
          console.log(response)
          useNotificationMessage('success','Uspešno promenjena lozinka!')
        })
    },

    async logout() {
      await this.revokeSession();
    },



    async autoLogin() {
      let redirectToRoute = '';

      const email = Cookies.get('email');
      console.log(email)
      await api
        .get('/user/me/', )
        .then((response) => {
          console.log(response)
          const userSessionFound = response.data;

          if (userSessionFound) {
            this.user = response.data
            redirectToRoute = '/';
          } else {
            Cookies.remove('userSessionToken', {
              path: '/'
            });
            redirectToRoute = 'login';
          }
        })
      return redirectToRoute;
    },

    setUserData(user: User) {
      this.user = user;
    },

    setUserToken(token: string) {
      this.token = token;
    },

    async setUserCookie(userSessionToken: string, email: string) {
      Cookies.set('userSessionToken', userSessionToken, {
        path: '/',
      });
      Cookies.set('email', email, {
        path: '/',
      });
    },
    async revokeSession() {
      Cookies.remove('userSessionToken', {
        path: '/'
      });
      this.$reset();
    },
  }
});
