import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import useMutations from "@/app/hooks/use-mutations";
import { zDrawingName } from "@/lib/types";
import { Button } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { HomeIcon, PlusIcon } from "lucide-react";
import Empty from "../components/ui/empty";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { createDrawing } = useMutations();
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleAddDrawing = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Add Drawing",
        message: "Drawing will be created in the root directory",
        value: "",
        placeholder: "Enter drawing name",
        schema: zDrawingName,
        handleSubmit: (value: string) => {
          createDrawing.mutate({ name: value });
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return (
    <article className="flex h-screen w-full items-center justify-center">
      <Empty.Root>
        <Empty.Header>
          <Empty.Media variant="icon">
            <HomeIcon />
          </Empty.Media>
          <Empty.Title>Welcome to Excalidraw Lite</Empty.Title>
          <Empty.Description>
            Select a drawing from the sidebar or create a new one to get started
          </Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <Button variant="soft" onClick={handleAddDrawing}>
            <PlusIcon className="size-4" />
            <span>Create New Drawing</span>
          </Button>
        </Empty.Content>
      </Empty.Root>
    </article>
  );
}
