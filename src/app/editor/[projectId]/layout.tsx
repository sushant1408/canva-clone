import { Metadata } from "next";
import { ReactNode } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";

type ProjectIdLayoutProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectIdLayoutProps): Promise<Metadata> {
  const { projectId } = await params;
  const data = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId!));

  return {
    title: `${data?.[0]?.name || "Project"}`,
  };
}

export default function ProjectIdLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
