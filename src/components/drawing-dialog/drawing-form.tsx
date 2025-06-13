import React from "react";
import drawingInputs from "@/actions/drawings/drawings.inputs";
import type { DrawingSelect } from "@/lib/types";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import useMutations from "@/hooks/use-mutations";
import { useAtom } from "jotai/react";
import { drawingDialogAtom } from "./drawing-dialog.store";
import { TextArea, TextField } from "@radix-ui/themes";

type Props = React.PropsWithChildren<{
  drawing?: DrawingSelect;
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
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <TextField.Root
                  placeholder="Enter a drawing title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <TextArea placeholder="Describe your drawing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </FormProvider>
  );
};

export default DrawingForm;
