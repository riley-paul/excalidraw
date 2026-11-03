import { Theme, type ThemeProps } from "@radix-ui/themes";
import React from "react";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  return (
    <Theme
      appearance="light"
      accentColor="blue"
      grayColor="gray"
      radius="large"
      hasBackground={false}
      {...props}
    />
  );
};

export default RadixProvider;
