import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./Pages/Index";
import CreateCampaign from "./Pages/CreateCampaign";
import SupportCampaigns from "./Pages/SupportCampaigns";
import CampaignDetail from "./Pages/CampaignDetail";

import Footer from "./Components/Footer";

const App = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="createcampaign" element={<CreateCampaign/>} />
      <Route path="supportcampaigns" element={<SupportCampaigns/>} />
      <Route path="supportcampaigns/detail/:campaignId" element={<CampaignDetail/>} />
    </Routes>
    <Footer/>
    </div>
  );
};

export default App;
