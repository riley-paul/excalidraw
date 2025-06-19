import { ACCENT_COLOR } from "@/lib/client/constants";
import { Theme } from "@radix-ui/themes";
import React from "react";

type Props = React.PropsWithChildren<{
  overrideAppearance?: "light" | "dark" | "inherit";
}>;

const RadixProvider: React.FC<Props> = ({ children, overrideAppearance }) => {
  return (
    <Theme
      appearance={overrideAppearance ?? "light"}
      accentColor={ACCENT_COLOR}
      grayColor="gray"
      radius="large"
      hasBackground={false}
    >
      {children}
    </Theme>
  );
};

export default RadixProvider;
