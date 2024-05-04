import { React, useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";

import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import { ethers } from "ethers";

import Nav from "../Components/Nav";
import { AppContext } from "../Reducer/AppContext";

import { ProgressBar } from "react-bootstrap";

const CampaignDetail = () => {
  const { state } = useContext(AppContext);

  // contract
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const ngoAddress = import.meta.env.VITE_NGO_ADDRESS;

  const provider = new ethers.providers.JsonRpcProvider(endPoint);
  const myContract = new ethers.Contract(
    contractAddress,
    MyContractArtifact.abi,
    provider
  );

  // browser
  const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
  const browserSigner = browserProvider.getSigner();

  const { campaignId } = useParams();

  const [signerAddress, setSignerAddress] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const [donationValue, setDonationValue] = useState(null);
  const [backerDonation, setBackerDonation] = useState(null);

  const [proofOfWork, setProofOfWork] = useState([]);

  const [donationError, setDonationError] = useState(false);

  const dataTypeRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const getAddress = async () => {
      try {
        const address = await browserSigner.getAddress();
        setSignerAddress(address);
      } catch (error) {
        console.error("Error retrieving signer address:", error);
        return null;
      }
    };

    getAddress();
  }, []);

  useEffect(() => {
    setCurrentId(campaignId);
  }, [campaignId]);

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
          amountSendToDonator: parseFloat(
            ethers.utils.formatEther(campaign.amountSendToDonator)
          ),
          amountSendToNgo: parseFloat(
            ethers.utils.formatEther(campaign.amountSendToNgo)
          ),
        });
        // console.log("campaigns", campaign);
      } catch (error) {
        console.log("error", error);
      }
    };

    getCurrentCampaign();
    console.log("current campaign", currentCampaign);
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
        // console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountCollected: amountCollected,
        }));
      }
    };

    const releaseFund = (currentId, amountNotYetSend, amountSendToDonator) => {
      if (currentId == currentCampaign.campaignId) {
        // console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountNotYetSend: amountNotYetSend,
          amountSendToDonator: amountSendToDonator,
        }));
      }
    };

    const CancelFund = (currentId, amountNotYetSend, amountSendToDonator) => {
      if (currentId == currentCampaign.campaignId) {
        // console.log("reach here");
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

  useEffect(() => {
    const getProofOfWork = async () => {
      try {
        const displayProofOfWork = await myContract.getProofsOfWork(currentId);
        if (displayProofOfWork) {
          setProofOfWork((prev) => {
            // Check if the proof of work already exists in the state
            const exists = prev.some(
              (proof) => proof.content === displayProofOfWork.content
            );
            if (!exists) {
              return [...prev, displayProofOfWork]; // Return new array with the new proof
            }
            return prev; // Return previous state unchanged if it already includes the current proof
          });
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    if (myContract) {
      getProofOfWork(); // Invoke the function
    }
  }, [myContract, currentId, proofOfWork]); // Include all dependencies in the dependency array

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

        // console.log("Transaction confirmed:", receipt);
        // Optionally, handle the confirmation with a user-friendly message
        alert(
          "Thank you for your donation! Your transaction has been confirmed."
        );
      }
    } catch (error) {
      console.log("error", error);
      alert("Failed to send support");
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
      // console.log("reach here");
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
      const campaign = await contractWithSigner.releaseFundForEndedCampaign(
        campaignId
      );
      alert("succeed release left fund");
    } catch (err) {
      console.log("err", err);
    }
  };

  const proofOfWorkSubmit = (e) => {
    e.preventDefault();
    const addProofOfWork = async () => {
      try {
        const contractWithSigner = state.contract;
        const campaign = await contractWithSigner.addProofOfWork(
          campaignId,
          dataTypeRef.current.value,
          contentRef.current.value,
          descriptionRef.current.value
        );
        alert('succeed added proof of Work!')
      } catch (err) {
        console.log("err", err);
        alert("added proof of work fail");
      }
    };

    if (
      descriptionRef.current.value != "" &&
      contentRef.current.value != "" &&
      descriptionRef.current.value != ""
    ) {
      addProofOfWork();
    } else {
      alert("you have field that has no value");
    }
  };

  return (
    <>
      <Nav />
      {currentCampaign ? (
        <div className="campaignDetail">
          <div className="fund-title">
            <h1>{currentCampaign.title}</h1>
          </div>
          <div className="fund-desc">
            <p>{currentCampaign.description}</p>
          </div>
          <div className="causes__img">
            <img src={currentCampaign.imgAddress} alt="" />
          </div>
          <div>
            <div className="progress-bar">
              <ProgressBar
                now={currentCampaign.amountCollected}
                max={currentCampaign.target}
                label={`${currentCampaign.amountCollected} / ${currentCampaign.target}`}
              />
              <div className="fund-desc">
                <div className="fund-count">
                  <h2>{`$ ${currentCampaign.amountCollected} ethers`}</h2>
                  <span>Amount Donated</span>
                </div>
                <div className="fund-count">
                  <h2>{`$ ${currentCampaign.target} ethers`}</h2>
                  <span>Target</span>
                </div>
                <div className="fund-count">
                  <h2>{`$ ${currentCampaign.amountNotYetSend} ethers`}</h2>
                  <span>amount Not Yet Send</span>
                </div>
              </div>
            </div>
            <div className="fund-count">
              <span>Amount Send To Donator : $ </span>
              <span>{currentCampaign.amountSendToDonator}</span>
            </div>
            <div className="fund-count">
              <span>Amount Send To Ngo : $ </span>
              <span>{currentCampaign.amountSendToNgo}</span>
            </div>
            <p className="camp-detail-deadline">
              {"Campaign DeadLine : " +
                formatUnixTime(currentCampaign.deadline)}
            </p>
          </div>
          {currentCampaign.amountCollected < currentCampaign.target &&
          new Date(currentCampaign.deadline * 1000) > new Date() ? (
            <div className="support-Button">
              <input
                type="number"
                id="numberInput"
                min="0.001"
                max="100"
                step="0.01"
                value={donationValue}
                defaultValue="1.00"
                onChange={handleDonationValue}
              />
              <br />
              <button className="btn" onClick={handleSendSupport}>
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
                  <button className="btn" onClick={releaseFund}>
                    Release your Fund
                  </button>{" "}
                  <br />
                  <button className="btn" onClick={cancelFund}>
                    Cancel your Fund
                  </button>
                </div>
              ) : (
                <div>
                  <p className="errorMessage">You havent support this campaign yet !</p>
                </div>
              )}
            </div>
          ) : (
            <div className="errorMessage">
              {currentCampaign.amountCollected >= currentCampaign.target &&
                "The Current has reached its target!"}{" "}
              <br />
              {new Date(currentCampaign.deadline * 1000) < new Date() &&
                "The campaign has passed its deadline !"}
            </div>
          )}
          {new Date(currentCampaign.deadline * 1000) < new Date() &&
            currentCampaign.amountNotYetSend > 0 && (
              <div className="helpRelease">
                <span>
                  Help to release Saved fund when Campaign deadline passed!
                </span>
                <button className="btn camp-detail" onClick={helpReleaseFund}>
                  release fund
                </button>
              </div>
            )}
          {proofOfWork.length > 0 == true &&
            proofOfWork.map((item, index) => {
              console.log("item", item[0]?.dataType);
              return (
                // Ensure that you are returning something from the map function
                item[0]?.dataType === "image" && ( // Use === for strict comparison and wrap JSX in parentheses
                  <div key={index} className="proofOfWork">
                    <h4>{`Proof Of Work Number ${index}`}</h4>
                    <img src={item[0]?.content} alt="" />
                    <div>{item[0]?.description}</div>
                  </div>
                )
              );
            })}
          {currentCampaign.amountCollected < currentCampaign.target &&
            new Date(currentCampaign.deadline * 1000) > new Date() &&
            currentCampaign.signer == signerAddress && (
              <form onSubmit={proofOfWorkSubmit}>
                <select className="select" name="dataType" ref={dataTypeRef} defaultValue="image">
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                  <option value="video">video</option>
                </select>
                <input className="proofOfWork-input" type="text" ref={contentRef} placeholder="Please Input Your Url"/>
                <textarea
                  className="desc"
                  ref={descriptionRef}
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="please enter your description here"
                ></textarea>
                <button className="btn" type="submit">Add proof of Work</button>
              </form>
            )}
        </div>
      ) : (
        "no Campaign mapped"
      )}
    </>
  );
};

export default CampaignDetail;
