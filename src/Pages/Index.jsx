import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/contracts/artifacts/MyContract.json";
import Nav from "../Components/Nav";
import index from "../assets/Pages/index.jpg";
import Potrait from "../assets/Portrait/Portrait.jpeg";
import Hkit from "../assets/Pages/hkit.jpg";
import Wrexham from "../assets/Pages/wrexham.jpg";
const Index = () => {

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const [indexInfo, setIndexInfo] = useState({
    campaignNumberBacked : null,
    currentCampaignNumber : null,
    numberOfFundRaised : null
  })

  
  return (
    <div className="App">
      <Nav />
      <main>
        <section className="slogan-Section">
          <div className="container">
            <div className="row">
              <div className="page-title col-md-6 d-flex align-items-center">
                <div className="text-content">
                  <h1>Bring new ideas to life, anywhere.</h1>
                  <p>
                    By using the new technology of BlockChain, Backers and
                    creator nowaday nowaday can enjoy their largest freedom
                  </p>
                </div>
              </div>
              <div className="indexBackgroundImage col-md-6">
                <img src={index} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </section>
        <section className="contract-info-section">
          <div className="container">
            <div className="row">
              <div className="section-title">
                <p>
                  <span></span>
                  OUR FEATURES
                </p>
                <h1>WE MAKE THIS WORLD MORE FAIR</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-3 ">
                <div className="contract-info-card  text-center">
                <i class="fa-solid fa-check"></i>
                <h4>Number of Campaigns backed</h4>
                </div>
              </div>
              <div className="col-12 col-md-3  ">
              <div className="contract-info-card text-center">
              <i class="fa-solid fa-hourglass-start"></i>
                <h4>Current Campaign</h4>
                </div>
              </div>
              <div className="col-12 col-md-3 ">
              <div className="contract-info-card  text-center">
              <i class="fa-solid fa-file-signature"></i>
                <h4>Contract Address</h4>
                <p>{contractAddress}</p>
                </div>
              </div>
              <div className="col-12 col-md-3  ">
              <div className="contract-info-card  text-center">
              <i class="fa-solid fa-comments-dollar"></i>
                <h4>Number of Fund Raised</h4>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="founder-section">
          <h2 className="text-center">Founder Introduction</h2>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 d-flex justify-content-end">
                <div className="founder-card">
                  <div className="founder-card-img">
                    <img src={Hkit} alt="HKIT" />
                    <div className="founder-card-content text-center">
                      <h4>
                        <a href="https://www.hkit.edu.hk/en/index.php">HKIT</a>
                      </h4>
                      <span>Mother School</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Repeat the same class adjustment for the second card */}
              <div className="col-12 col-md-6 d-flex justify-content-start">
                <div className="founder-card">
                  <div className="founder-card-img">
                    <img src={Wrexham} alt="Wrexham U" />
                    <div className="founder-card-content text-center">
                      <h4>
                        <a href="https://wrexham.ac.uk/">Wrexham U</a>
                      </h4>
                      <span>Mother School</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-center ">
                <div className="founder-card">
                  <div className="founder-card-img">
                    <img src={Potrait} alt="" />
                    <div className="founder-card-content text-center">
                      <h4>Yeung Ka Chun</h4>
                      <span>Founder</span>
                      <p className="founder-card-hidden-content">
                        I am currently a student of Wrexham University and HKIT,
                        I want to build a platform that without the control from
                        any organization
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
