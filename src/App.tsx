import "./App.css";
import { WithContentFieldExtension } from "./hooks/useFieldExtension";

function App() {
  return (
    <WithContentFieldExtension pollForm={false}>
      <p>ih</p>
    </WithContentFieldExtension>
  );
}

export default App;
