import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferResponseType } from "hono";

export type ResponseType = InferResponseType<
  (typeof client.api.projects)["templates"]["$get"],
  200
>;

const useGetTemplates = () => {
  const query = useInfiniteQuery<ResponseType, Error>({
    queryKey: ["templates"],
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryFn: async ({ pageParam }) => {
      const response = await client.api.projects.templates.$get({
        query: { page: (pageParam as number).toString(), limit: "5" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      return await response.json();
    },
  });

  return query;
};

export { useGetTemplates };
