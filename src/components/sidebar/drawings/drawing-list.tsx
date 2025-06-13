import React from "react";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "../../drawing-dialog/drawing-dialog.store";
import type { DrawingSelect } from "@/lib/types";
import DrawingItem from "./drawing-item";
import { Button, Heading, IconButton } from "@radix-ui/themes";

type Props = {
  drawings: DrawingSelect[];
};

const DrawingList: React.FC<Props> = ({ drawings }) => {
  const [, dispatch] = useAtom(drawingDialogAtom);
  return (
    <article className="grid gap-3">
      <header className="flex h-4 items-center justify-between gap-2 px-3">
        <Heading
          as="h2"
          size="1"
          weight="bold"
          color="gray"
          className="uppercase"
        >
          Drawings
        </Heading>
        <Button
          size="1"
          variant="ghost"
          onClick={() => dispatch({ type: "open" })}
        >
          <i className="fas fa-plus" />
          <span>Add Drawing</span>
        </Button>
      </header>
      <section className="grid">
        {drawings.map((drawing) => (
          <DrawingItem key={drawing.id} drawing={drawing} />
        ))}
      </section>
    </article>
  );
};

export default DrawingList;
