import { formatDistanceToNow } from "date-fns";
import {
  CopyIcon,
  FileIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { useConfirm } from "@/hooks/use-confirm";
import { Input } from "@/components/ui/input";
import { PROJECT_NAME_MAX_LENGTH } from "@/features/editor/constants";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface ProjectCardProps {
  project: ResponseType["data"];
  variant?: "card" | "row";
}

const ProjectCard = ({ project, variant = "card" }: ProjectCardProps) => {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState<string>(project.name);

  const { mutate: duplicateMutate, isPending: isDuplicating } =
    useDuplicateProject();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteProject();
  const { mutate } = useUpdateProject(project.id);

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to delete this project.",
  });

  const onClick = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const handleRename = () => {
    if (project.name === name) {
      return;
    }

    if (name.length === 0) {
      toast.error("Name cannot be empty");
      return;
    }

    if (name.length > PROJECT_NAME_MAX_LENGTH) {
      toast.error(
        `Name cannot exceed the limit of ${PROJECT_NAME_MAX_LENGTH} characters`
      );
      return;
    }

    mutate(
      { name },
      {
        onSuccess: () => {
          toast.success("Project renamed successfully");
        },
        onError: () => {
          toast.error("Failed to rename the project");
        },
      }
    );
  };

  const onCopy = (id: string) => {
    setSelectedId(id);
    duplicateMutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Project duplicated successfully");
        },
        onError: () => {
          toast.error("Failed duplicate the project");
        },
        onSettled: () => {
          setSelectedId(null);
        },
      }
    );
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      setSelectedId(id);
      deleteMutate(
        { id },
        {
          onSuccess: () => {
            toast.success("Project deleted successfully");
          },
          onError: () => {
            toast.error("Failed delete the project");
          },
          onSettled: () => {
            setSelectedId(null);
          },
        }
      );
    }
  };

  if (variant === "row") {
    return (
      <>
        <ConfirmationDialog />
        <TableRow>
          <TableCell
            onClick={() => onClick(project.id)}
            className="font-medium flex items-center gap-x-2 cursor-pointer"
          >
            <FileIcon className="size-6" />
            {project.name}
          </TableCell>
          <TableCell
            onClick={() => onClick(project.id)}
            className="hidden md:table-cell cursor-pointer"
          >
            {project.width} x {project.height} px
          </TableCell>
          <TableCell
            onClick={() => onClick(project.id)}
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
                <DropdownMenuLabel onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center group/name mb-2 gap-x-1">
                    <Input
                      className="text-xl text-wrap font-medium h-[25px] border-x-0 border-t-0 border-transparent hover:border-b hover:border-border hover:border-dashed w-auto p-0 focus-visible:outline-none focus-visible:ring-transparent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleRename}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleRename();
                        }
                      }}
                    />
                    <PencilIcon className="opacity-0 group-hover/name:opacity-100 !size-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Edited{" "}
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(project.id);
                  }}
                  className="h-10 cursor-pointer"
                >
                  <CopyIcon className="size-4 mr-2" />
                  Make a copy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="h-10 cursor-pointer"
                >
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <>
      <ConfirmationDialog />
      <div
        key={project.id}
        onClick={() => onClick(project.id)}
        className="flex flex-col h-full w-full cursor-pointer gap-y-2"
      >
        <div className="h-full w-full rounded-md bg-muted aspect-square px-8 pt-4 relative group hover:opacity-75 overflow-hidden">
          {project.thumbnailUrl ? (
            <div className="h-full overflow-hidden">
              <Image
                alt={project.name}
                src={project.thumbnailUrl}
                className="object-cover !relative"
                fill
              />
            </div>
          ) : (
            <div className="bg-white h-full w-full" />
          )}

          <div className="absolute inset-0 top-0 left-0 opacity-0 group-hover:opacity-100 bg-black/15 z-[4]" />

          {selectedId === project.id && (isDuplicating || isDeleting) ? (
            <div className="absolute inset-0 top-0 left-0 bg-black/15 z-[4] flex items-center justify-center">
              <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : null}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                size="icon"
                variant="secondary"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition z-[10]"
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center group/name mb-2 gap-x-1">
                  <Input
                    className="text-xl text-wrap font-medium h-[25px] border-x-0 border-t-0 border-transparent hover:border-b hover:border-border hover:border-dashed w-auto p-0 focus-visible:outline-none focus-visible:ring-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleRename}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleRename();
                      }
                    }}
                  />
                  <PencilIcon className="opacity-0 group-hover/name:opacity-100 !size-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Edited{" "}
                  {formatDistanceToNow(project.updatedAt, {
                    addSuffix: true,
                  })}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(project.id);
                }}
                disabled={isDuplicating || isDeleting}
                className="h-10 cursor-pointer"
              >
                <CopyIcon className="size-4 mr-2" />
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                disabled={isDuplicating || isDeleting}
                className="h-10 cursor-pointer"
              >
                <TrashIcon className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col">
          <span className="font-medium truncate">{project.name}</span>
          <p className="text-xs text-muted-foreground">
            {project.width} x {project.height} px
          </p>
        </div>
      </div>
    </>
  );
};

export { ProjectCard };
