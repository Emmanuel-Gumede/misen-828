import { Routes, Route } from "react-router-dom";
import "./Misen.css";
import Layout from "./Layout";
import Games from "./pages/Games";
import { MisenProvider } from "./context/MisenContext";

function Misen() {
  return (
    <MisenProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Games />} />
        </Route>
      </Routes>
    </MisenProvider>
  );
}

export default Misen;
