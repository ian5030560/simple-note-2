import React from "react";
import { createRoot } from "react-dom/client";
import PageNavigation from "./outline.jsx";

function App() {
  return (
    <div className="app">
      {<li>index1</li>}
      <PageNavigation />
    </div>
  );
}

export const Tree = App;
const root = createRoot(document.getElementById("root"));
root.render(<App />);

export default App;
