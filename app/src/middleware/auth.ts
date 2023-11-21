import {useAuthenticatedUserStore} from "stores/authUserStore";
import { Cookies } from 'quasar';
import useAttemptAutoLogin from 'src/composables/attemptAutoLogin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function auth ({ next }) {

  const userStore = useAuthenticatedUserStore();
  const userSessionTokenExists = Cookies.has('userSessionToken');

  if (!userSessionTokenExists) {
    return next({
      name: 'login'
    })
  }
  const attemptAutoLogin = async () => {
    const shouldAutoLogin = await useAttemptAutoLogin();
    if(shouldAutoLogin){
      return next();
    }else{
      return next({name: 'login'})
    }
  };
  if (userSessionTokenExists && Object.keys(userStore.user).length === 0) {
    attemptAutoLogin();
  }else{
    return next();
  }

}
