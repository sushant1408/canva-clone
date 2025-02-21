"use client";

import {
  AlertTriangleIcon,
  LayoutGridIcon,
  ListIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useLocalStorage } from "react-use";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectCard } from "./project-card";

const ProjectsSection = () => {
  const router = useRouter();

  const [viewMethod, setViewMethod] = useLocalStorage<"list" | "grid">(
    "projects-view-method",
    "grid"
  );

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetProjects();

  const onChangeViewMethod = () => {
    setViewMethod(viewMethod === "grid" ? "list" : "grid");
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangleIcon className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <SearchIcon className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <TooltipWrapper
          label={viewMethod === "list" ? "View as Grid" : "View as List"}
          side="bottom"
          sideOffset={10}
        >
          <Button size="icon" variant="ghost" onClick={onChangeViewMethod}>
            {viewMethod === "list" ? (
              <LayoutGridIcon className="size-4" />
            ) : (
              <ListIcon className="size-4" />
            )}
          </Button>
        </TooltipWrapper>
      </div>

      {viewMethod === "grid" && (
        <div className="grid h-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((project) => (
                <ProjectCard
                  project={project}
                  key={project.id}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}

      {viewMethod === "list" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Edited</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((project) => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    variant="row"
                  />
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export { ProjectsSection };
