import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return JSON.stringify(error.response?.data, null, 2)
  }

  if (error instanceof Error) {
    return error.message
  }

  return JSON.stringify(error)
}
