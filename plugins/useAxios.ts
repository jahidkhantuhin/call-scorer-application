import { useContext, useRouter, useRoute } from '@nuxtjs/composition-api'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import swalMixin, { showToast } from '~/utils/swalMixin'
import showErrorOnXHRFail from '~/utils/showErrorOnXHRFail'
import { isAuthRoute } from '~/utils/authRoutes'

const handleLogout = async ({ $auth, router, route }: any) => {
  if (!isAuthRoute(route.value.fullPath)) {
    router.push({
      path: '/login',
      query: !route.value.fullPath.includes('redirect=')
        ? {
            redirect: route.value.fullPath,
          }
        : {},
    })
  }
}

export default function useAxios(): NuxtAxiosInstance {
  const router = useRouter()
  const route = useRoute()
  const context = useContext()
  const app = context.app
  const { $axios, $auth } = app

  const $swal = swalMixin((app as any).$swal as any)

  const translate = (text: string, params?: any): string =>
    (app as any).i18n.t(text, params)

  if (!$axios) {
    // throw error, no store provided
    throw new Error('nuxt axios is not defined!')
  }

  $axios.interceptors.response.use(
    (response) => {
      // console.log("response",response)
      if (response.status === 401) {
        handleLogout({ $auth, router, route })
      }
      return response
    },
    (error) => {
      showErrorOnXHRFail({
        $swal,
        error: error,
        translate: translate,
        showToast,
      })
      if (error && error.response && error.response.status === 401) {
        handleLogout({ $auth, router, route })
      }
      return Promise.reject(error)
    }
  )

  return $axios
}
