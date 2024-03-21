import "@testing-library/jest-dom/jest-globals";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true });

Object.defineProperty(window, "BroadcastChannel", {
  writable: true,
  value: class {
    postMessage() {}
  },
});
