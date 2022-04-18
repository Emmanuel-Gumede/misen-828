import { Routes, Route } from "react-router-dom";
import "./Misen.css";
import Layout from "./Layout";
import Games from "./pages/Games";
import { MisenProvider } from "./context/MisenContext";
import Groups from "./pages/Groups";
import { GroupProvider } from "./context/GroupContext";

function Misen() {
  return (
    <MisenProvider>
      <GroupProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Games />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
        </Routes>
      </GroupProvider>
    </MisenProvider>
  );
}

export default Misen;
