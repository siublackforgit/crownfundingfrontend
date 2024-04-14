import { React, useEffect, useState, useContext } from "react";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import Nav from "../Components/Nav";
import { AppContext } from "../Reducer/AppContext";

const CampaignDetail = () => {
  const { state } = useContext(AppContext);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const provider = new ethers.providers.JsonRpcProvider(endPoint);

  const myContract = new ethers.Contract(
    contractAddress,
    MyContractArtifact.abi,
    provider
  );

  const { campaignId } = useParams();
  const [currentCampaign, setCurrentCampaign] = useState(null);

  useEffect(() => {
    console.log("param", campaignId);

    const getCurrentCampaign = async () => {
      try {
        const campaign = await myContract.getCampaign(campaignId);
        setCurrentCampaign(campaign);
        console.log("campaigns", campaign);
      } catch (error) {
        console.log("error", error);
      }
    };

    getCurrentCampaign();
  }, []);

  const handleSendSupport = async () => {
    try {
      console.log(state.contract);
      if (state.contract) {
        const sendSupport = await state.contract.donateCampaign(campaignId, {
          value: ethers.utils.parseEther("10.0"),
          gasLimit: 500000,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const releaseFund = async () => {
    try {
      if(state.contract && state.signer ){
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const release = await contractWithSigner.releaseFund(campaignId,signerAddress)
      }
    }catch(error){
      console.log('error',error);
    }
  }

  return (
    <>
      <Nav />
      {currentCampaign ? (
        <>
          <div>{currentCampaign.title}</div>
          <div>
            <p>
              {"Amount Collected: " +
                parseInt(currentCampaign.amountCollected._hex, 16)}
            </p>
            <p>
              {"Amount Not Yet send : " +
                parseInt(currentCampaign.amountNotYetSend._hex, 16)}
            </p>
          </div>
          <button onClick={handleSendSupport}>Send Your Support</button>
          <button onClick={releaseFund}>Release your Fund</button>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CampaignDetail;
