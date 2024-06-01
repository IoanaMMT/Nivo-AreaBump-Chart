import "./App.css";
import MyResponsiveAreaBump from "./areabump";
import { data } from "./data";

function App() {
  return (
    <div className="App" style={{ height: "80vh" }}>
      <MyResponsiveAreaBump data={data} />
    </div>
  );
}

export default App;
