import { datadogRum } from "@datadog/browser-rum";
import { SeoMetaTags } from "./components/SeoMetaTags/SeoMetaTags";
import Theme from "./components/Theme";
import { WithExtensionContext } from "./hooks/withExtensionContext";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const ddToken = import.meta.env.PUBLIC_DATADOG_TOKEN;
    const ddId = import.meta.env.PUBLIC_DATADOG_ID;
    const ddEnv = import.meta.env.PUBLIC_DATADOG_ENV;

    if (ddToken && ddId && ddEnv) {
      datadogRum.init({
        applicationId: ddId,
        clientToken: ddToken,
        env: ddEnv,
        site: "datadoghq.com",
        service: "dc-extension-seo-meta-tags",
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: "allow",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        usePartitionedCrossSiteSessionCookie: true,
        proxy: "https://dd-proxy.amplience.net",
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);

  return (
    <WithExtensionContext>
      <Theme>
        <SeoMetaTags />
      </Theme>
    </WithExtensionContext>
  );
}

export default App;
