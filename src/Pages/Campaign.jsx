import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";

const Campaign = () => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const [campaigns, setCampaigns] = useState([]);

  useEffect(()=>{
    const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const myContract = new ethers.Contract(contractAddress,MyContractArtifact.abi,provider)
    console.log('contract address',contractAddress);
    console.log('endPoint',endPoint);
    const getCampaigns = async () => {
        try {
          const number = await myContract.getAllCampaigns();
          const activeCampaignNumber = await myContract.getActiveCampaignList();
          setCampaigns(activeCampaignNumber);
          console.log('campaign',campaigns);
        } catch (error) {
          console.log('error',error);
        }
      }

      getCampaigns();

  },[])

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
