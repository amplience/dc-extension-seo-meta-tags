export function track(win: Window, eventName: string, value: unknown) {
  if (win.aptrinsic) {
    win.aptrinsic("track", eventName, value);
  }
}
