import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { qDrawing } from "@/lib/client/queries";
import Drawing from "@/components/drawing";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ params: { drawingId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(qDrawing(drawingId));
  },
  onError: () => {
    toast.error("Failed to load drawing. Please try again.");
    throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  const { drawingId } = Route.useParams();
  return (
    <div className="h-screen w-full">
      <Drawing drawingId={drawingId} />
    </div>
  );
}
