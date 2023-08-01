import { useEffect, useState } from 'react'
import axios, {
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig
} from 'axios'

type ApiData = any // Define the type of data returned by the API

interface ApiError {
  message: string
  status: number
}

interface ApiResponse {
  data: ApiData | null
  loading: boolean
  error: ApiError | null
}

const useApiFetch = (
  url: string,
  method: AxiosRequestConfig['method'] = 'GET'
): ApiResponse => {
  // State variables to manage the API response
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ApiError | null>(null)

  // Fetch data from the API when the component mounts and whenever the URL or method changes
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const config: AxiosRequestConfig = {
          method,
          url
        }

        const response: AxiosResponse = await axios(config)

        setData(response.data)
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
  }, [url, method])

  return { data, loading, error }
}

export default useApiFetch
