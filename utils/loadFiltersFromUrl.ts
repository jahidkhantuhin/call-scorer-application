export default function loadFiltersFromUrl({ $route }: { $route: any }) {
  const query = { ...$route.query };
  const { page, limit } = query;
  
  delete query["page"];
  delete query["limit"];

  return {
    pagination: {
      page,
      limit
    },
    filters: query,
  };
}
