import { ReactNode, ReactElement } from "react";
import { WithExtensionContext } from "../hooks/withExtensionContext";
import Theme from "../components/Theme";

export const wrapper = ({ children }: { children: ReactNode }) => (
  <WithExtensionContext>
    <Theme>{children as ReactElement}</Theme>
  </WithExtensionContext>
);
