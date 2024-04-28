import { React, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppContext } from "../Reducer/AppContext";

import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";
import { id } from "ethers/lib/utils";

const SupportCampaigns = () => {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;

  const { state } = useContext(AppContext);

  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const { campaignId } = useParams();

  useEffect(()=>{

    const provider = new ethers.providers.JsonRpcProvider(endPoint);

    async function checkBlock(blockNumber) {
      const block = await provider.getBlock(blockNumber);
      console.log('Block:', block);
    }
    
    checkBlock(contractAddress);
  })

  useEffect(() => {

    const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const myContract = new ethers.Contract(
      contractAddress,
      MyContractArtifact.abi,
      provider
    );

    const getCampaignList = async () => {
      try {
        const idArray = [];
        const campaignsArray = [];
        console.log('hihi')
        const campaignsIdArray = await myContract.getAllCampaignsId();
        campaignsIdArray.forEach((id) => {
          const idString = id.toString();
          idArray.push(idString);
        });
        if (idArray.length > 0) {
          for (var i = 0; i < idArray.length; i++) {
            const arrayContent = idArray[i];
            const campaign = await myContract.getCampaign(arrayContent);
            campaignsArray.push(campaign);
          }
          setCampaigns(campaignsArray);
        }
      } catch (err) {
        console.log("err", err);
      }
    };
    console.log('state',state)

    if ( state.status == 'Succeed Contract') {
      getCampaignList();
    }
  }, [state.status]);

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
}

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
                <h1>Back Before The Time Expires</h1>
                <h3>Active Campaigns</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {console.log('campaigns',campaigns)}
            {campaigns &&
              campaigns.length > 0 &&
              campaigns.map((item, key) =>
              new Date(item.deadline * 1000)  > new Date()
              && 
              parseFloat(ethers.utils.formatEther(item.target)) > parseFloat(ethers.utils.formatEther(item.amountCollected))              
                ? (
                  <div
                    index={key}
                    className="col-xl-4 col-lg-4 col-md-6 support-campaign-card"
                    key={item.campaignId._hex} // Assuming campaignId is unique
                    onClick={() => {
                      const intId = parseInt(item.campaignId._hex, 16); // Making sure to parse as hex
                      console.log("intId", intId);
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
                          {"Campaign ID: " + parseInt(item.campaignId._hex, 16)}
                        </p>
                        <p>{"Target: " + parseFloat(ethers.utils.formatEther(item.target)) + " ethers"}
                        </p>
                        <p>
                          {"Amount Collected: " +
                           parseFloat(ethers.utils.formatEther(item.amountCollected)) +
                            " ethers"}
                        </p>
                        <p>
                          {"Amount sent to Donator : " +
                        parseFloat(ethers.utils.formatEther(item.amountSendToDonator)) +
                            " ethers"}
                        </p>
                        <p>
                          {"Amount sent to Ngo : " +
                        parseFloat(ethers.utils.formatEther(item.amountSendToNgo))  +
                            " ethers"}
                        </p>
                        <p>
                        {"Deadline : " +
                        formatUnixTime(item.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="section-title text-center">
                <h3>Succeed Campaigns</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {console.log('campiagns',campaigns)}
            {campaigns &&
              campaigns.length > 0 &&
              campaigns.map((item, key) =>
              new Date() > new Date(item.deadline * 1000)  
              ||
              parseFloat(ethers.utils.formatEther(item.amountCollected)) >= parseFloat(ethers.utils.formatEther(item.target))   
               ? (
                  <div
                    index={key}
                    className="col-xl-4 col-lg-4 col-md-6 support-campaign-card"
                    key={item.campaignId._hex} // Assuming campaignId is unique
                    onClick={() => {
                      const intId = parseInt(item.campaignId._hex, 16); // Making sure to parse as hex
                      console.log("intId", intId);
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
                          {"Campaign ID: " + parseInt(item.campaignId._hex, 16)}
                        </p>
                        <p>{"Target: " + parseFloat(ethers.utils.formatEther(item.target)) + " ethers"}
                        </p>
                        <p>
                          {"Amount Collected: " +
                           parseFloat(ethers.utils.formatEther(item.amountCollected)) +
                            " ethers"}
                        </p>
                        <p>
                          {"Amount sent to Donator : " +
                        parseFloat(ethers.utils.formatEther(item.amountSendToDonator)) +
                            " ethers"}
                        </p>
                        <p>
                          {"Amount sent to Ngo : " +
                        parseFloat(ethers.utils.formatEther(item.amountSendToNgo))  +
                            " ethers"}
                        </p>
                        <p>
                        {"Deadline : " +
                        formatUnixTime(item.deadline)}
                        </p>
                        <div className="errorMessage">
                        This Campaign has completed
                      </div>
                      </div>
                    </div>
                  </div>
                ) : null
              )
              }
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportCampaigns;
