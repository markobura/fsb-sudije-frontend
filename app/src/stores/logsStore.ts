import {defineStore} from 'pinia';
import {HttpMethod, useFetch} from "src/composables/fetch";
import {Log, LogDetail, LogDetailsResponse, LogsListResponse} from "src/interfaces/logs";
import {extractTimeFromTimestamp} from "src/utils/dateHook";

export const useLogsStore = defineStore('logsStore', {
  state: () => ({
    logs: [] as Log[],
    logDetails: [] as LogDetail[],
    filteredLogDetails: [] as LogDetail[],
    logDetailsMinTime: '',
    logDetailsMaxTime: '',
    logDetailsUsers: [] as { value: any; label: string; }[]
  }),

  getters: {
    getLogs(state) {
      return state.logs
    },
    getLogDetails(state) {
      return state.logDetails
    },
    getFilteredLogs(state) {
      return state.filteredLogDetails
    },
    getLogUserOptions(state) {
      return state.logDetailsUsers
    },
    getMinTime(state) {
      return state.logDetailsMinTime
    },
    getMaxTime(state) {
      return state.logDetailsMaxTime
    },
  },

  actions: {
    async fetchLogs() {
      const {data: {logs}} = await useFetch<LogsListResponse>({
        url: '/log-viewer/file-list',
        method: HttpMethod.GET
      })

      this.logs = logs;
    },
    async fetchLogDetails(logFolder: string, logFile: string) {
      this.logDetails = [];
      const response = await useFetch<LogDetailsResponse, null, { logFolder: string, logFile: string }>({
        url: '/log-viewer/file',
        method: HttpMethod.GET,
        params: {logFolder, logFile}
      })

      this.logDetails = response.data.logDetails

      this.filteredLogDetails = this.logDetails;
      const users = this.logDetails.map(detail => {
        return {
          value: detail.request.user["App\\Models\\User"].id,
          label: `${detail.request.user["App\\Models\\User"].name} ${detail.request.user["App\\Models\\User"].surname}`
        }
      });

      const uniqueUserStringArray = Array.from(new Set(users.map(user => JSON.stringify(user))));

      this.logDetailsUsers = uniqueUserStringArray.map(user => JSON.parse(user))
      this.logDetailsUsers.unshift({
        value: -1,
        label: 'SVI'
      })
      this.logDetailsMinTime = extractTimeFromTimestamp(this.logDetails[0].request_timestamp)
      this.logDetailsMaxTime = extractTimeFromTimestamp(this.logDetails[this.logDetails.length - 1].request_timestamp)
    },
    filterLogs(filters: {
      startTime: string,
      endTime: string,
      selectedUser: {label: string, value: number}
    }) {

      if (filters.selectedUser.value !== -1) {
        this.filteredLogDetails = this.logDetails.filter(detail => {
          return extractTimeFromTimestamp(detail.request_timestamp) >= filters.startTime &&
            extractTimeFromTimestamp(detail.request_timestamp) <= filters.endTime &&
            detail.request.user["App\\Models\\User"].id === filters.selectedUser.value
        })
      } else {
        this.filteredLogDetails  = this.logDetails.filter(detail => {
          return extractTimeFromTimestamp(detail.request_timestamp) >= filters.startTime &&
            extractTimeFromTimestamp(detail.request_timestamp) <= filters.endTime
        })

      }

    }

  }
});
