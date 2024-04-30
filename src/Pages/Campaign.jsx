import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";

const Campaign = () => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const [campaignsId, setCampaignsId] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const myContract = new ethers.Contract(
      contractAddress,
      MyContractArtifact.abi,
      provider
    );

    const releaseFundForAllEndedCampaign = async () => {
      try {
        await myContract.releaseFundsForEndedCampaigns();
        console.log("release fund", myContract.releaseFundsForEndedCampaigns());
      } catch (err) {
        console.log("error", err);
      }
    };

    const getCampaigns = async () => {
      try {
        const campaignsIdArray = await myContract.getAllCampaignsId();
        setCampaignsId(campaignsId);
        console.log("campaignsId", campaignsId);
      } catch (error) {
        console.log("error", error);
      }
    };

    releaseFundForAllEndedCampaign();
    getCampaigns();
  }, []);

  return (
    <>
      <Nav />
      <section className="hero-caption">
        <p>Discover what’s possible when a community creates together.</p>
        <h1>Bring new ideas to life, anywhere.</h1>
      </section>
      <section className="campaign-list">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center">
                <p>
                  <span></span>
                  Popular causes
                </p>
                <h1>Back Before Time Expires</h1>
              </div>
            </div>
          </div>
          <div className="row"></div>
        </div>
      </section>
    </>
  );
};

export default Campaign;
