import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.ai)["remove-bg"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.ai)["remove-bg"]["$post"]
>["json"];

const useRemoveBackground = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.ai["remove-bg"].$post({ json });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      
      return await response.json();
    },
  });

  return mutation;
};

export { useRemoveBackground };
