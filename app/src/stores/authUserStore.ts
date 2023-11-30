import {defineStore} from 'pinia';
import {User} from "src/interfaces/user";
import {
  AutoLoginResponse,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from "src/interfaces/auth";
import {HttpMethod, useFetch} from "src/composables/fetch";
import useNotificationMessage, {NotificationType} from "src/composables/notificationMessage";
import {Cookies} from "quasar";
import {useSettingsStore} from "stores/settingsStore";

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
    async login(request: LoginRequest) {
      const {
        message,
        data: {
          user,
          token,
          sessionTimeout
        }
      } = await useFetch<LoginResponse, LoginRequest>({url: '/auth/login', method: HttpMethod.POST, data: request});

      this.setUserData(user);

      this.setUserToken(token);

      this.setUserSessionDurationData(sessionTimeout);

      await this.setUserCookie(token);

      useNotificationMessage(NotificationType.SUCCESS, message);

    },

    async logout() {
      await useFetch({url: '/auth/logout', method: HttpMethod.POST});
      await this.revokeSession();
    },


    async forgotPassword(email: string) {
      const {message} = await useFetch<ForgotPasswordResponse, { email: string }>({
        url: '/auth/forgot-password',
        method: HttpMethod.POST,
        data: {email}
      });
      useNotificationMessage(NotificationType.SUCCESS, message)

    },

    async activateAccount(request: ResetPasswordRequest) {
      const {message} = await useFetch<ResetPasswordResponse, ResetPasswordRequest>({
        url: '/auth/activate-account',
        method: HttpMethod
          .POST,
        data: request
      });
      useNotificationMessage(NotificationType.SUCCESS, message);
    },

    async resetPassword(request: ResetPasswordRequest) {
      const {message} = await useFetch<ResetPasswordResponse, ResetPasswordRequest>({
        url: '/auth/reset-password',
        method: HttpMethod
          .POST,
        data: request
      });
      useNotificationMessage(NotificationType.SUCCESS, message);
    },

    async autoLogin() {
      const {
        data: {
          user,
          isUserSessionActive,
          sessionTimeout
        }
      } = await useFetch<AutoLoginResponse>({url: '/auth/auto-login', method: HttpMethod.POST})

      if (isUserSessionActive) {
        const userSessionToken: string = Cookies.get('userSessionToken');
        this.setUserData(user);
        this.setUserToken(userSessionToken)
        this.setUserSessionDurationData(sessionTimeout);

      }else{
        Cookies.remove('userSessionToken', {
          path: '/'
        });
      }
      return isUserSessionActive;
    },

    setUserData(user: User) {
      this.user = user;
    },

    setUserToken(token: string) {
      this.token = token;
    },

    setUserSessionDurationData(sessionDuration: number) {
      useSettingsStore().setSessionTimeout(sessionDuration);
    },

    async setUserCookie(userSessionToken: string) {
      Cookies.set('userSessionToken', userSessionToken, {
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
