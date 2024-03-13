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
}
