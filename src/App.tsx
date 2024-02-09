import { SeoMetaTags } from "./components/seoMetaTags/SeoMetaTags";
import Theme from "./components/Theme";
import { WithContentFieldExtension } from "./hooks/withContentFieldExtension";
import "@fontsource/ibm-plex-sans";

function App() {
  return (
    <WithContentFieldExtension>
      <Theme>
        <SeoMetaTags />
      </Theme>
    </WithContentFieldExtension>
  );
}

export default App;
