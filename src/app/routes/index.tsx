import { alertSystemAtom } from "@/app/components/alert-system/alert-system.store";
import useMutations from "@/app/hooks/use-mutations";
import { zDrawingName } from "@/lib/types";
import { Button, Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { HomeIcon, PlusIcon } from "lucide-react";

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
      <section className="flex flex-col items-center gap-5">
        <Heading as="h2" size="4" className="flex flex-col items-center gap-1">
          <HomeIcon className="text-accent-9 size-12" />
          <span>Welcome to Excalidraw</span>
        </Heading>
        <Button variant="soft" onClick={handleAddDrawing}>
          <PlusIcon className="size-4" />
          <span>Create New Drawing</span>
        </Button>
      </section>
    </article>
  );
}
