import { SeoMetaTags } from "./components/SeoMetaTags";
import Theme from "./components/Theme";
import { WithContentFieldExtension } from "./hooks/withFieldExtension";

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
