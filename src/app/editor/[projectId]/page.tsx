import { protectServer } from "@/features/auth/utils";
import { Editor } from "@/features/editor/components/editor";

export default async function ProjectIdPage() {
  await protectServer();

  return <Editor />;
}
