"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangleIcon,
  CopyIcon,
  FileIcon,
  LayoutGridIcon,
  ListIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocalStorage } from "react-use";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import Image from "next/image";

const ProjectsSection = () => {
  const router = useRouter();

  const [viewMethod, setViewMethod] = useLocalStorage<"list" | "grid">(
    "projects-view-method",
    "grid"
  );

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetProjects();

  const onChangeViewMethod = () => {
    setViewMethod(viewMethod === "grid" ? "list" : "grid");
  };

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (status === "error") {
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

  if (!data?.pages.length) {
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
                <div
                  key={project.id}
                  onClick={() => router.push(`/editor/${project.id}`)}
                  className="flex flex-col h-full w-full cursor-pointer gap-y-2"
                >
                  <div className="h-full w-full rounded-md bg-muted aspect-square px-8 pt-4 relative group">
                    {project.thumbnailUrl ? (
                      <Image alt={project.name} src={project.thumbnailUrl} />
                    ) : (
                      <div className="bg-white h-full w-full" />
                    )}

                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 z-[10]"
                        >
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel>
                          <div className="flex flex-col"></div>
                          <span className="text-lg font-medium">
                            {project.name}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Edited{" "}
                            {formatDistanceToNow(project.updatedAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="h-10 cursor-pointer">
                          <CopyIcon className="size-4 mr-2" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem className="h-10 cursor-pointer">
                          <TrashIcon className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {project.width} x {project.height} px
                    </p>
                  </div>
                </div>
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
                  <TableRow key={project.id}>
                    <TableCell
                      onClick={() => router.push(`/editor/${project.id}`)}
                      className="font-medium flex items-center gap-x-2 cursor-pointer"
                    >
                      <FileIcon className="size-6" />
                      {project.name}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push(`/editor/${project.id}`)}
                      className="hidden md:table-cell cursor-pointer"
                    >
                      {project.width} x {project.height} px
                    </TableCell>
                    <TableCell
                      onClick={() => router.push(`/editor/${project.id}`)}
                      className="hidden md:table-cell cursor-pointer"
                    >
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="flex items-center justify-end">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                          <DropdownMenuItem className="h-10 cursor-pointer">
                            <CopyIcon className="size-4 mr-2" />
                            Make a copy
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-10 cursor-pointer">
                            <TrashIcon className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
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
