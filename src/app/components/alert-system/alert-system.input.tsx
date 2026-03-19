import React from "react";
import type { InputAlertProps } from "./alert-system.types";
import { Dialog, Button, Text, TextField } from "@radix-ui/themes";
import { useForm } from "@tanstack/react-form";
import { z } from "astro/zod";

const AlertSystemContentInput: React.FC<InputAlertProps> = ({
  title,
  message,
  value = "",
  placeholder,
  schema = z.string().min(1, "This field is required"),
  handleSubmit,
}) => {
  const form = useForm({
    defaultValues: { value },
    validators: { onChange: z.object({ value: schema }) },
    onSubmit: ({ value: { value } }) => handleSubmit(value),
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{message}</Dialog.Description>
        <form.Field
          name="value"
          children={(field) => (
            <div className="mt-6">
              <TextField.Root
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                size="3"
                placeholder={placeholder}
              />
              {/*{error && (
                <Text color="red" size="1" className="mt-1">
                  {error.message}
                </Text>
              )}*/}
            </div>
          )}
        />
        <footer className="mt-4 flex justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="submit">Submit</Button>
        </footer>
      </form>
    </>
  );
};

export default AlertSystemContentInput;
