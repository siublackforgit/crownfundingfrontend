import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./Pages/Index";
import Campaign from "./Pages/Campaign";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="campaign" element={<Campaign/>} />
    </Routes>
  );
};

export default App;
