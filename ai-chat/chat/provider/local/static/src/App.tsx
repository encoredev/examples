import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home.tsx";
import { EncoreChat } from "./EncoreChat.tsx";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="/chat" element={<EncoreChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
