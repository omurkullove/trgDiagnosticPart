import React from "react";
import { Route, Routes } from "react-router-dom";

//Custom
import TagFile from "./Components/TagFile";
import Diagnostic from "./Components/Diagnostic";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TagFile />} />
      <Route path="/trg-diagnostic" element={<Diagnostic />} />
      <Route />
    </Routes>
  );
};

export default MainRoutes;
