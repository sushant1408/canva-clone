import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof client.api.projects)["$get"],
  200
>;

const useGetProjects = () => {
  const query = useInfiniteQuery<ResponseType, Error>({
    queryKey: ["projects"],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryFn: async ({ pageParam }) => {
      const response = await client.api.projects.$get({
        query: { page: (pageParam as number).toString(), limit: "5" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return await response.json();
    },
  });

  return query;
};

export { useGetProjects };
