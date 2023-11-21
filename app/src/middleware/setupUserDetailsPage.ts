import {useUserStore} from "stores/userStore";
import {AccountState} from "src/interfaces/user";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default async function setupUserDetailsPage ({ to, next }) {

  const userStore = useUserStore();

  await userStore.showUserDetails(to.params.id);

  return next();
}
