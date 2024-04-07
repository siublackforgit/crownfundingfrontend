import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./Pages/Index";
import Campaign from "./Pages/Campaign";
import CreateCampaign from "./Pages/CreateCampaign";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="campaign" element={<Campaign/>} />
      <Route path="createcampaign" element={<CreateCampaign/>} />
    </Routes>
  );
};

export default App;
