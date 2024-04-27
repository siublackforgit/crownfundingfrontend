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
  const ngoAddress = import.meta.env.VITE_NGO_ADDRESS;

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

  const [donationError, setDonationError] = useState(false);

  useEffect(() => {
    const getCurrentCampaign = async () => {
      try {
        const campaign = await myContract.getCampaign(campaignId);
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
    const updateAmount = (campaignId, amountCollected) => {
      if (campaignId == currentCampaign.campaignId) {
        console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountCollected: amountCollected,
        }));
      }
    };

    const releaseFund = (campaignId, amountNotYetSend, amountSendToDonator) => {
      if (campaignId == currentCampaign.campaignId) {
        console.log("reach here");
        setCurrentCampaign((prev) => ({
          ...prev,
          amountNotYetSend: amountNotYetSend,
          amountSendToDonator: amountSendToDonator,
        }));
      }
    };

    const CancelFund = (campaignId, amountNotYetSend, amountSendToDonator) => {
      if (campaignId == currentCampaign.campaignId) {
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

  const handleSendSupport = async () => {
    // frontend validation to  check if send value exceed target
    setDonationError(false);

    if (
      donationValue + currentCampaign.amountCollected >=
      currentCampaign.target
    ) {
      setDonationError(true);
      return;
    }

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
      console.log("reach here");
      if (state.contract && state.signer) {
        console.log("contract", state.contract);
        const contractWithSigner = state.contract;
        const signerAddress = state.signer.getAddress();
        const cancel = await contractWithSigner.cancelFund(
          campaignId,
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

  return (
    <>
      <Nav />
      {currentCampaign ? (
        <>
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
              {"Amount Not Released send : " +
                currentCampaign.amountNotYetSend +
                " ethers"}
            </p>
          </div>
          {currentCampaign.amountCollected < currentCampaign.target ? (
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
          ) : (
            <div className="errorMessage">
              The Campaign Already reached it's target !
            </div>
          )}
        </>
      ) : (
        "no Campaign mapped"
      )}
    </>
  );
};

export default CampaignDetail;
