import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":id"]["$delete"],
  201
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":id"]["$delete"]
>["param"];

const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const response = await client.api.projects[":id"].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", { id: data.id }],
      });
    },
  });

  return mutation;
};

export { useDeleteProject };
