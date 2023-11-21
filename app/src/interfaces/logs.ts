export interface LogsListResponse {
  data: {
    logs: Log[]
  }
}

export interface Log {
  folder: string,
  files: string[]
}
export interface LogDetailsResponse {
  message: string,
  data: {
    logDetails: LogDetail[]
  }
}

export interface LogDetail {
  request: {
    user: {
      "App\\Models\\User": {
        id: number,
        name: string,
        surname: string
      }
    }
  },
  response: string[],
  request_timestamp: string,
  response_timestamp: string
}
