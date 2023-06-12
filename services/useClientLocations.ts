import useApi from './useApi'
export default function () {
  const { get, post, put, Delete } = useApi()

  const locationById = (id: string | number) => get(`/locations/${id}`)

  const create = (body: any) => {
    return post('/locations', body)
  }

  const deleteLocation = (id: string | number) => {
    return Delete(`/locations/${id}`)
  }

  const updateLocation = (data: { [key: string]: string | number }) =>
    put(`/locations/${data.id}`, data)

  const clientLocations = (id: string | number) =>
    get(`/clients/${id}/locations`)

  return {
    create,
    locationById,
    deleteLocation,
    updateLocation,
    clientLocations,
  }
}
