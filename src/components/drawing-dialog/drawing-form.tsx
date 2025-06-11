import React from "react";
import drawingInputs from "@/actions/drawings/drawings.inputs";
import type { MinimalDrawingSelect } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "./drawing-dialog.store";

type Props = React.PropsWithChildren<{
  drawing?: MinimalDrawingSelect;
}>;

const schema = drawingInputs.create;
type Schema = z.infer<typeof schema>;

const DrawingForm: React.FC<Props> = ({ drawing, children }) => {
  const { createDrawing, updateDrawing } = useMutations();
  const [, dispatchAlertDialog] = useAtom(drawingDialogAtom);

  const form = useForm<Schema>({
    defaultValues: {
      title: "",
      description: "",
      ...drawing,
    },
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    drawing
      ? await updateDrawing.mutateAsync({ ...data, id: drawing.id })
      : await createDrawing.mutateAsync(data);
    dispatchAlertDialog({ type: "close" });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a drawing title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your drawing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
};

export default DrawingForm;
