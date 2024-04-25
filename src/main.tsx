import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { init as initGainsight } from "./lib/gainsight";
import { initDatadog } from "./lib/datadog";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

initGainsight(window, import.meta.env.PUBLIC_APTRINSIC_APP_ID);
initDatadog();
