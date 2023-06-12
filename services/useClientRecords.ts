import useApi from "./useApi";
export default function () {
  const { get, post, put, Delete } = useApi();

  const list = (filters: any) => get("/clients", filters);
  const listStatus = () => get("/statuses");

  const clientById = (id: string | number) => get(`/clients/${id}`);

  const create = (body: any) => post("/clients", body);

  const update = (data: { [key: string]: string | number }) =>
    put(`clients/${data.id}`, data);

  const changeStatus = (id: string | number) =>
    put(`clients/${id}/change-status`, {});

  const deleteClient = (id: string | number) => {
    return Delete(`/clients/${id}`);
  };

  return {
    list,
    create,
    update,
    clientById,
    deleteClient,
    changeStatus,
    listStatus,
  };
}
