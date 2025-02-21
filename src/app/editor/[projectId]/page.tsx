"use client";

import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/components/editor";
import { useGetProject } from "@/features/projects/api/use-get-project";

interface ProjectIdPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectIdPage({ params }: ProjectIdPageProps) {
  const { projectId } = use(params);
  const { data, isLoading, isError } = useGetProject(projectId);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-full flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Failed to fetch project</p>
        <Button asChild variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return <Editor initialData={data} />;
}
