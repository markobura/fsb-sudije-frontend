import {defineStore} from 'pinia';
import {HttpMethod, useFetch} from "src/composables/fetch";
import {SetSessionTimeoutResponse} from "src/interfaces/sessionTimeout";
import useNotificationMessage, {NotificationType} from "src/composables/notificationMessage";

export const useSettingsStore = defineStore('settingsStore', {

  state: () => ({
    sessionTimeout: 0
  }),
  getters: {
    getSessionTimeout: (state) => state.sessionTimeout,
  },
  actions: {
    async updateUserSessionTimeoutApi(timeout: number) {

      const {message, data: {sessionTimeout}} = await useFetch<SetSessionTimeoutResponse, { timeout: number }>({
        url: '/settings/session-timeout',
        method: HttpMethod.PATCH,
        data: {timeout}
      })

      this.setSessionTimeout(sessionTimeout.timeout_period)

      useNotificationMessage(NotificationType.SUCCESS, message);

    },
    setSessionTimeout(timeout_period: number) {
      this.sessionTimeout = timeout_period;
    }
  }
});
