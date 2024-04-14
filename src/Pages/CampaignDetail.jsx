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

  const [donationValue, setDonationValue] = useState(null);
  const [backerDonation, setBackerDonation] = useState(null);

  useEffect(() => {
    const getCurrentCampaign = async () => {
      try {
        const campaign = await myContract.getCampaign(campaignId);
        setCurrentCampaign({
          ...campaign,
          target: ethers.utils.formatEther(campaign.target),
          amountCollected: ethers.utils.formatEther(campaign.amountCollected),
          amountNotYetSend: ethers.utils.formatEther(campaign.amountNotYetSend),
        });
        console.log("campaigns", campaign);
      } catch (error) {
        console.log("error", error);
      }
    };
    getCurrentCampaign();
  }, []);

  useEffect(() => {
    const getCurrentDonation = async () => {
      try {
        console.log("address", state.signer.getAddress());
        const address = state.signer.getAddress();
        const currentDonation = await myContract.displayFund(
          campaignId,
          address
        );

        if (currentDonation) {
          console.log('currentDOnation',currentDonation);
          const parsedDonation = parseFloat(
            ethers.utils.formatEther(currentDonation)
          );
          setBackerDonation(parsedDonation);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getCurrentDonation();
  });

  useEffect(() => {
    console.log('current',currentCampaign)
    const updateAmount = (campaignId, amountCollected) => {
      if(campaignId == currentCampaign.campaignId) {
        console.log('reach here')
        setCurrentCampaign(prev=>({
          ...prev,
          amountCollected:amountCollected
        }))
      }
    };

    const releaseFund = (campaignId, amountNotYetSend, amountSendToDonator) => {
      if(campaignId == currentCampaign.campaignId) {
        console.log('reach here')
        setCurrentCampaign(prev=>({
          ...prev,
          amountNotYetSend:amountNotYetSend,
          amountSendToDonator:amountSendToDonator
        }))
      }
    };

    const CancelFund = (campaignId, amountNotYetSend, amountSendToDonator) => {
      if(campaignId == currentCampaign.campaignId) {
        console.log('reach here')
        setCurrentCampaign(prev=>({
          ...prev,
          amountNotYetSend:amountNotYetSend,
          amountSendToDonator:amountSendToDonator
        }))
      }
    };

    myContract.on("AmountCollectedUpdated", updateAmount);
    myContract.on("ReleaseFund", releaseFund);
    myContract.on("CancelFund", CancelFund);

    return () => {
      myContract.off("AmountCollectedUpdated", updateAmount);
      myContract.off("ReleaseFund", releaseFund);
      myContract.off("CancelFund", CancelFund);
    };
  },[]);

  const handleSendSupport = async () => {
    try {
      console.log(state.contract);
      if (state.contract) {
        const sendSupport = await state.contract.donateCampaign(campaignId, {
          value: ethers.utils.parseEther(donationValue.toString()),
          gasLimit: 500000,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const releaseFund = async () => {
    try {
      if (state.contract && state.signer) {
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const release = await contractWithSigner.releaseFund(
          campaignId,
          signerAddress
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const cancelFund = async () => {
    try {
      if (state.contract && state.signer) {
        console.log("contract", state.contract);
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const cancel = await contractWithSigner.cancelFund(
          campaignId,
          signerAddress,
          "0x4534D0bb12326AF8c43f25Ebe772EB98F1C2d70B"
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDonationValue = (e) => {
    setDonationValue(e.target.value);
  };

  return (
    <>
      <Nav />
      {currentCampaign ? (
        <>
          <div>{currentCampaign.title}</div>
          <div>
            <p>{"Target: " + parseFloat(currentCampaign.target)}</p>
            <p>
              {"Amount Collected: " +
                parseFloat(currentCampaign.amountCollected) +
                " ethers"}
            </p>
            <p>
              {"Amount Not Yet send : " +
                parseFloat(currentCampaign.amountNotYetSend) +
                " ethers"}
            </p>
          </div>
          <input
            type="number"
            id="numberInput"
            min="0.001"
            max="100"
            value={donationValue}
            defaultValue={1}
            onChange={handleDonationValue}
          />
          <br />
          <button onClick={handleSendSupport}>
            Send Your Support
          </button> <br /> <br />
          {backerDonation && parseFloat(backerDonation) > 0 ? (
            <div>
              <p>{`Your Current donation is ${backerDonation} ethers`}</p>
              <button onClick={releaseFund}>Release your Fund</button> <br />
              <button onClick={cancelFund}>Cancel your Fund</button>
            </div>
          ) : (
            <div>
              <p>You havent support this campaign yet</p>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default CampaignDetail;
