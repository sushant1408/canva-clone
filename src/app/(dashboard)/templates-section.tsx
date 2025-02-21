"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { toast } from "sonner";

import { useCreateProject } from "@/features/projects/api/use-create-project";
import {
  ResponseType,
  useGetTemplates,
} from "@/features/projects/api/use-get-templates";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { TemplateCard } from "./template-card";

const TemplatesSection = () => {
  const router = useRouter();

  const paywall = usePaywall();
  const { data, isPending, isError } = useGetTemplates();
  const { mutate, isPending: isCreating } = useCreateProject();

  const onCreateProject = (template: ResponseType["data"][0]) => {
    if (template.isPro && paywall.shouldBlock) {
      paywall.triggerPaywall();
      return;
    }

    mutate(
      {
        name: `${template.name} project`,
        height: template.height,
        width: template.width,
        json: template.json,
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

  if (isPending) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Start from a template</h3>
        <div className="flex items-center justify-center h-32">
          <LoaderIcon className="animate-spin text-muted-foreground !size-6" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Start from a template</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <TriangleAlertIcon className="text-muted-foreground !size-6" />
          <p>Failed to load templates</p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length || !data.pages[0].data.length) {
    return null;
  }

  return (
    <div>
      <h3 className="font-semibold text-lg">Start from a template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.data.map((template) => (
              <TemplateCard
                key={template.id}
                height={template.height}
                imageSrc={template.thumbnailUrl || ""}
                isPro={template.isPro}
                onClick={() => onCreateProject(template)}
                width={template.width}
                title={template.name}
                description={`${template.width} x ${template.height} px`}
                disabled={isCreating}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export { TemplatesSection };
