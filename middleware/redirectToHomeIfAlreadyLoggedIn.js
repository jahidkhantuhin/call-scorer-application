export default function ({redirect, store}) {
  const isAuthenticated = store.getters['users/isAuthenticated'] ? true : false
  if (isAuthenticated) {
    // redirect({path: '/'})
  }
}