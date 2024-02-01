import { SeoMetaTags } from "./components/SeoMetaTags";
import Theme from "./components/Theme";
import { WithContentFieldExtension } from "./hooks/useFieldExtension";

function App() {
  return (
    <WithContentFieldExtension pollForm={false}>
      <Theme>
        <SeoMetaTags />
      </Theme>
    </WithContentFieldExtension>
  );
}

export default App;
