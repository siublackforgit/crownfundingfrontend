import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./Pages/Index";
import Campaign from "./Pages/Campaign";
import CreateCampaign from "./Pages/CreateCampaign";
import SupportCampaigns from "./Pages/SupportCampaigns";
import CampaignDetail from "./Pages/CampaignDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="campaign" element={<Campaign/>} />
      <Route path="createcampaign" element={<CreateCampaign/>} />
      <Route path="supportcampaigns" element={<SupportCampaigns/>} />
      <Route path="supportcampaigns/detail/:campaignId" element={<CampaignDetail/>} />
    </Routes>
  );
};

export default App;
