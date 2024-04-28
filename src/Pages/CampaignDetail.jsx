import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import { ethers } from "ethers";

import Nav from "../Components/Nav";
import { AppContext } from "../Reducer/AppContext";

const CampaignDetail = () => {
  const { state } = useContext(AppContext);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const ngoAddress = import.meta.env.VITE_NGO_ADDRESS;

  const provider = new ethers.providers.JsonRpcProvider(endPoint);
  const myContract = new ethers.Contract(
    contractAddress,
    MyContractArtifact.abi,
    provider
  );
  const { campaignId } = useParams();
  const [currentId, setCurrentId] = useState(null);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const [donationValue, setDonationValue] = useState(null);
  const [backerDonation, setBackerDonation] = useState(null);

  const [donationError, setDonationError] = useState(false);

  useEffect(()=>{
    setCurrentId(campaignId);
  },[campaignId])

  useEffect(() => {
    const getCurrentCampaign = async () => {
      try {
        const campaign = await myContract.getCampaign(currentId);
        setCurrentCampaign({
          ...campaign,
          target: parseFloat(ethers.utils.formatEther(campaign.target)),
          amountCollected: parseFloat(
            ethers.utils.formatEther(campaign.amountCollected)
          ),
          amountNotYetSend: parseFloat(
            ethers.utils.formatEther(campaign.amountNotYetSend)
          ),
        });
        console.log("campaigns", campaign);
      } catch (error) {
        console.log("error", error);
      }
    };

    getCurrentCampaign();
  }, [currentId]);

  useEffect(() => {
    const getCurrentDonation = async () => {
      try {
        const address = state.signer.getAddress();
        const currentDonation = await myContract.displayFund(
          currentId,
          address
        );

        if (currentDonation) {
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
    console.log("current", currentCampaign);
    const updateAmount = (currentId, amountCollected) => {
      if (currentId == currentCampaign.campaignId) {
        console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountCollected: amountCollected,
        }));
      }
    };

    const releaseFund = (currentId, amountNotYetSend, amountSendToDonator) => {
      if (currentId == currentCampaign.campaignId) {
        console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountNotYetSend: amountNotYetSend,
          amountSendToDonator: amountSendToDonator,
        }));
      }
    };

    const CancelFund = (currentId, amountNotYetSend, amountSendToDonator) => {
      if (currentId == currentCampaign.campaignId) {
        console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountNotYetSend: amountNotYetSend,
          amountSendToDonator: amountSendToDonator,
        }));
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
  }, []);

  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000); // Convert Unix time from seconds to milliseconds
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns month from 0-11
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Padding single digits with leading zero
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`;
  };

  const handleSendSupport = async () => {
    // frontend validation to  check if send value exceed target
    setDonationError(false);

    if (
      donationValue + currentCampaign.amountCollected >
      currentCampaign.target
    ) {
      setDonationError(true);
      return;
    }

    try {
      if (state.contract) {
        const sendSupport = await state.contract.donateCampaign(currentId, {
          value: ethers.utils.parseEther(donationValue.toString()),
          gasLimit: 500000,
        });

        const receipt = await sendSupport.wait();

        console.log('Transaction confirmed:', receipt);
        // Optionally, handle the confirmation with a user-friendly message
        alert('Thank you for your donation! Your transaction has been confirmed.');
      }
    } catch (error) {
      console.log("error", error);
      alert('Failed to send support');
    }
  };

  const releaseFund = async () => {
    try {
      if (state.contract && state.signer) {
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const release = await contractWithSigner.releaseFund(
          currentId,
          signerAddress
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const cancelFund = async () => {
    try {
      console.log("reach here");
      if (state.contract && state.signer) {
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const cancel = await contractWithSigner.cancelFund(
          currentId,
          signerAddress,
          ngoAddress
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDonationValue = (e) => {
    setDonationValue(e.target.value);
  };

  const helpReleaseFund = async () => {
    try {
      const contractWithSigner = state.contract;
      const campaign = await contractWithSigner.releaseFundForEndedCampaign(campaignId);
    } catch(err) {
      console.log('err',err)
    }
  }

  return (
    <>
      <Nav />
      {currentCampaign ? (
        <div className="campaignDetail">
          <div className="causes__img">
            <img src={currentCampaign.imgAddress} alt="" />
          </div>
          <div className="causes__caption">
            <h4>{currentCampaign.title}</h4>
          </div>
          <div>{currentCampaign.title}</div>
          <div>
            <p>{"Target: " + currentCampaign.target}</p>
            <p>
              {"Amount Collected : " +
                currentCampaign.amountCollected +
                " ethers"}
            </p>
            <p>
              {"Amount of donation required: " +
                (currentCampaign.target - currentCampaign.amountCollected) +
                " ethers"}
            </p>
            <p>
              {"Amount of Not Released send : " +
                currentCampaign.amountNotYetSend +
                " ethers"}
            </p>
            <p>
              {"Campaign DeadLine : " +
                formatUnixTime(currentCampaign.deadline)}
            </p>
          </div>
          {currentCampaign.amountCollected < currentCampaign.target 
          &&
          new Date(currentCampaign.deadline * 1000)  > new Date()
          ? (
            <div className="support Button">
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
              </button>{" "}
              <br />
              {donationError && (
                <div className="errorMessage">
                  The support cannot exceed the target value
                </div>
              )}
              {backerDonation && parseFloat(backerDonation) > 0 ? (
                <div>
                  <p>{`Your Current donation is ${backerDonation} ethers`}</p>
                  <button onClick={releaseFund}>Release your Fund</button>{" "}
                  <br />
                  <button onClick={cancelFund}>Cancel your Fund</button>
                </div>
              ) : (
                <div>
                  <p>You havent support this campaign yet</p>
                </div>
              )}
            </div>
          ) : 
            <div className="errorMessage">
             {currentCampaign.amountCollected >= currentCampaign.target 
              &&
              "The Current has reached its target!"
             } <br />
             {  new Date(currentCampaign.deadline * 1000)  < new Date() 
             &&
            "The campaign has passed its deadline !"
             }
            </div>
           }
           { 
           
           new Date(currentCampaign.deadline * 1000)  < new Date()
              &&
             currentCampaign.amountNotYetSend > 0
             &&
             <div className="helpRelease">
             Help to release Saved fund when Campaign deadline passed!
            <button onClick={helpReleaseFund}>
             release fund
            </button>
           </div>
           
           }
        </div>
      ) : (
        "no Campaign mapped"
      )}
    </>
  );
};

export default CampaignDetail;
