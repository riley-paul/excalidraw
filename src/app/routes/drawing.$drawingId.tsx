import { createFileRoute, notFound } from "@tanstack/react-router";
import { qDrawing } from "@/lib/client/queries";
import Drawing from "@/app/components/drawing";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ params: { drawingId }, context: { queryClient } }) => {
    const drawing = await queryClient.fetchQuery(qDrawing(drawingId));
    if (!drawing) throw notFound();
    return drawing;
  },
});

function RouteComponent() {
  const { drawingId } = Route.useParams();
  return (
    <div className="h-screen w-full flex-1">
      <Drawing drawingId={drawingId} />
    </div>
  );
}
