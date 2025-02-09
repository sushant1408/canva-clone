"use client";

import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { ArrowRightIcon, LoaderIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Banner = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();

  const onCreateProject = () => {
    mutate(
      {
        name: "Untitled project",
        height: 1200,
        width: 900,
        json: "",
      },
      {
        onSuccess: ({ data }) => {
          toast.success("Project created successfully");
          router.push(`/editor/${data.id}`);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  return (
    <div className="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]">
      <div className="rounded-full md:flex items-center justify-center hidden size-28 bg-white/50">
        <div className="rounded-full flex items-center justify-center size-20 bg-white">
          <SparklesIcon className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Visualize your ideas with Canva Clone
        </h1>
        <p className="text-xs md:text-sm mb-2">
          Turn inspiration into design in to time. Simply upload an image and
          let AI do the rest.
        </p>
        <Button
          variant="secondary"
          onClick={onCreateProject}
          className="w-[160px]"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
          ) : (
            <>
              Start creating
              <ArrowRightIcon className="size-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export { Banner };
