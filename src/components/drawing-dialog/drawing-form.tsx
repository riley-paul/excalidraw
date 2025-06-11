import React from "react";
import drawingInputs from "@/actions/drawings/drawings.inputs";
import type { MinimalDrawingSelect } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  drawing?: MinimalDrawingSelect;
};

const schema = drawingInputs.create;
type Schema = z.infer<typeof schema>;

const DrawingForm: React.FC<Props> = ({ drawing }) => {
  const form = useForm<Schema>({
    defaultValues: drawing,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    console.log("Form submitted with data:", data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Great drawing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default DrawingForm;
