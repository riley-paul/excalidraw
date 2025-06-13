import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <Theme ref={ref} appearance="dark" accentColor="indigo" grayColor="gray" radius="large">
        {children}
      </Theme>
    );
  }
);

export default RadixProvider;
