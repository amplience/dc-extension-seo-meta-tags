export declare global {
  interface Window {
    aptrinsic: {
      (...args: unknown[]): void;
      q?: unknown[];
      p?: string;
      c?: { allowCrossDomain: boolean };
    };
  }

  type SdkError = {
    code: string;
    message: string;
  };

  type BroadcastMessage = {
    type: "title" | "description";
    sources: string[];
    value: string;
  };

  type SeoValues = {
    title: string;
    description: string;
  };
}
