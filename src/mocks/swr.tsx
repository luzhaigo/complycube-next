import { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

export const MockSWRConfig = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
};
