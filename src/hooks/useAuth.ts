import { useEffect, useState } from 'react'
import axios, {
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig
} from 'axios'
import type { UserValidation, User } from '../types'

interface ApiError {
  message: string
  status: number
}

interface ApiResponse {
  response: User | null
  loading: boolean
  error: ApiError | null
}

const useAuth = (
  action: 'login' | 'register' | 'none',
  url: string,
  method: AxiosRequestConfig['method'] = 'GET',
  data?: UserValidation
): ApiResponse => {
  // State variables to manage the API response
  const [response, setResponse] = useState<User | null>(null)
  console.log('Response', response)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiError | null>(null)

  // Fetch data from the API when the component mounts and whenever the URL or method changes
  useEffect(() => {
    if (action !== 'none') {
      const fetchData = async (): Promise<void> => {
        try {
          setLoading(true)
          setError(null)

          const config: AxiosRequestConfig = {
            method,
            url: `${url}/auth/${action}`,
            data
          }

          const response: AxiosResponse = await axios(config)

          setResponse(response.data)
        } catch (err) {
          const axiosError = err as AxiosError

          const status = axiosError.response?.status ?? 500

          setError({
            message: axiosError.message,
            status
          })
        } finally {
          setLoading(false)
        }
      }
      fetchData() // eslint-disable-line @typescript-eslint/no-floating-promises
    }
  }, [url, method, data, action])

  return { response, loading, error }
}

export default useAuth
