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

  type WorkerMessage = {
    type: "title" | "description";
    sources: string[];
    value: string;
  };
}
