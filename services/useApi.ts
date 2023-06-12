/**
 * Experimental
 */
import useAxios from '~/plugins/useAxios'

const includes = {
  withCredentials: true,
}

export default function useApi() {
  const $axios = useAxios()

  const get = (url: string, params?: any) =>
    $axios.get(url, { params, ...includes })

  const post = (url: string, data: any, headers?: any[]) =>
    $axios.post(url, data, { headers, ...includes })

  const put = (url: string, data: any, headers?: any[]) =>
    $axios.put(url, data, { headers, ...includes })

  const Delete = (url: string, data?: any, headers?: any[]) =>
    $axios.delete(url, {
      data,
      withCredentials: true,
    })

  return {
    get,
    post,
    put,
    Delete,
  }
}
