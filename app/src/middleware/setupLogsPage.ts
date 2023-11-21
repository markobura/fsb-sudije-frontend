import {useUserStore} from "stores/userStore";
import {AccountState} from "src/interfaces/user";
import {useLogsStore} from "stores/logsStore";
import {log} from "echarts/types/src/util/log";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default async function setupLogsPage({next}) {

  const logsStore = useLogsStore();

  logsStore.$reset();

  await logsStore.fetchLogs();

  return next();
}
