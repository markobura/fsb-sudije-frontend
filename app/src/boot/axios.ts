import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import useRouteRequiresAuth from 'src/composables/routeRequiresAuth';
import useHandleErrors from 'src/composables/handleErrors';
import {Cookies,Loading} from 'quasar';
import {useAuthenticatedUserStore} from "stores/authUserStore";

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.BACKEND_APP_BASE_URL });

api.interceptors.request.use((config)=>{
  Loading.show();
  if(useRouteRequiresAuth(`${config.url}`)){
    config.headers['Authorization'] = `Bearer ${Cookies.get('userSessionToken')}`
  }
  return config;
}, ()=>{
  Loading.hide();
});

api.interceptors.response.use((response)=>{
  Loading.hide();
  return response;
}, (error)=>{

  Loading.hide();
  if(useHandleErrors(error.response.status, error.response.data.errors)){
    const authUserStore = useAuthenticatedUserStore();
    authUserStore.revokeSession().then(()=>{
      window.location.replace('/auth/login');
    });
  }
  return Promise.reject(error);
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
