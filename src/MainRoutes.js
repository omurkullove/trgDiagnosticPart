import React from "react";
import { Route, Routes } from "react-router-dom";

//Custom
import TagFile from "./Components/TagFile";
import Diagnostic from "./Components/Diagnostic";
import Results from "./Components/Results/Results";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TagFile />} />
      <Route path="/trg-diagnostic" element={<Diagnostic />} />
      <Route path="/results/:resultsId" element={<Results />} />
      <Route />
    </Routes>
  );
};

export default MainRoutes;
