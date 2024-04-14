import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";

const SupportCampaigns = () => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const navigate = useNavigate();
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const { campaignId } = useParams();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const myContract = new ethers.Contract(
      contractAddress,
      MyContractArtifact.abi,
      provider
    );
    console.log("contract address", contractAddress);
    console.log("endPoint", endPoint);
    console.log('campaignId',campaignId);
    const getActiveCampaignList = async () => {
      try {
        const campaigns  = await myContract.getActiveCampaignList();
        console.log("activeCampaigns", campaigns);
        setActiveCampaigns(campaigns);
        console.log('activeCampaign',activeCampaigns);
      } catch (error) {
        console.log("error", error);
      }
    };

    getActiveCampaignList();
  }, []);

  return (
    <>
      <Nav />
      <section className="list-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center">
                <p>
                  <span></span>
                  Popular causes
                </p>
                <h1>
                Back Before The Time Expires
                </h1>
              </div>
            </div>
          </div>
          <div className="row">
            {activeCampaigns && activeCampaigns.length &&
              activeCampaigns.map((item,index)=>(
                <div 
                className="col-xl-4 col-lg-4 col-md-6 support-campaign-card"
                key={index}
                onClick={()=>{
                  const intId = parseInt(item.campaignId._hex);
                  console.log('intId',intId);
                  navigate(`/supportcampaigns/detail/${intId}`);
                }}
                >
                <div className="causes white-bg mb-30">
                  <div className="causes__img">
                    <img src={item.imgAddress} alt="" />
                  </div>
                  <div className="causes__caption">
                    <h4>{item.title}</h4>
                  </div>
                  <div className="causes_info">
                    <p>
                      {'CampaignId :'+parseInt(item.campaignId._hex)}
                    </p>
                    <p>
                      {'Target : '+parseInt(item.target._hex)}
                    </p>
                    <p>
                      {'Amount Collected : '+parseInt(item.amountCollected._hex)}
                    </p>
                    <p>
                      {'Amount not yet send : '+parseInt(item.amountNotYetSend._hex)}
                    </p>
                  </div>
                </div>
              </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportCampaigns;
