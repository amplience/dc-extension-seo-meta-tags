export function init(window: Window, aptrinsicId: string) {
  if (!aptrinsicId) {
    return;
  }

  window.aptrinsic = function (...args: unknown[]) {
    (window.aptrinsic.q = window.aptrinsic.q || []).push(args);
  };

  window.aptrinsic.p = aptrinsicId;
  window.aptrinsic.c = { allowCrossDomain: true };

  const script = window.document.createElement("script");
  script.async = true;
  script.src = `https://web-sdk.aptrinsic.com/api/aptrinsic.js?a=${aptrinsicId}`;
  const s = window.document.getElementsByTagName("script")[0];
  s.parentNode?.insertBefore(script, s);
}
