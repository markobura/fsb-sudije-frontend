import {useAuthenticatedUserStore} from "stores/authUserStore";
import useNotificationMessage, {NotificationType} from "src/composables/notificationMessage";

export default async function useAttemptAutoLogin() {
  const userStore = useAuthenticatedUserStore();
  const isUserSessionActive = await userStore.autoLogin();

  if(!isUserSessionActive){
    useNotificationMessage(NotificationType.ERROR,'Istekla Vam je sesija, molimo ulogujte se ponovo!');
    return false
  }else{
    return true;
  }

}
