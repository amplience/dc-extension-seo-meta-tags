import { SeoMetaTags } from "./components/SeoMetaTags/SeoMetaTags";
import Theme from "./components/Theme";
import { WithExtensionContext } from "./hooks/withExtensionContext";

function App() {
  return (
    <WithExtensionContext>
      <Theme>
        <SeoMetaTags />
      </Theme>
    </WithExtensionContext>
  );
}

export default App;
