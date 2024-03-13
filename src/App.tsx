import { SeoMetaTags } from "./components/SeoMetaTags/SeoMetaTags";
import Theme from "./components/Theme";
import { WithContentFieldExtension } from "./hooks/withContentFieldExtension";

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
