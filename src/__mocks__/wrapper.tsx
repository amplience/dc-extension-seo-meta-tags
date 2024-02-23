import { ReactNode, ReactElement } from "react";
import { WithContentFieldExtension } from "../hooks/withContentFieldExtension";
import Theme from "../components/Theme";

export const wrapper = ({ children }: { children: ReactNode }) => (
  <WithContentFieldExtension>
    <Theme>{children as ReactElement}</Theme>
  </WithContentFieldExtension>
);
