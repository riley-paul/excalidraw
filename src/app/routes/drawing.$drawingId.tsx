import { createFileRoute, notFound } from "@tanstack/react-router";
import Drawing from "@/app/components/drawing";
import { GetDrawingDocument } from "../gql.gen";

export const Route = createFileRoute("/drawing/$drawingId")({
  component: RouteComponent,
  loader: async ({ params: { drawingId }, context }) => {
    const { data: { drawing } = {} } = await context.apolloClient.query({
      query: GetDrawingDocument,
      variables: { drawingId },
    });
    if (!drawing) throw notFound();
    return { drawing };
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
