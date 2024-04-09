import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";

const CreateCampaign = () => {
  const [campaignForm, setCampaignForm] = useState({
    address: null,
    email: null,
    imgAddress: null,
    title: null,
    target: null,
    videoAddress: null,
    deadLine: null,
    description: null,
  });

  const handleForm = (e, keyWords) => {
    setCampaignForm((prev) => ({
      ...prev,
      [keyWords]: e.target.value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("form", campaignForm);
    try {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const myContract = new ethers.Contract(
        contractAddress,
        MyContractArtifact.abi,
        signer
      );
      console.log("contract address", contractAddress);
      console.log("provider", provider);
      console.log("signer", signer);

      const transaction = await myContract.createCampaign(
        campaignForm.address,
        campaignForm.email,
        campaignForm.imgAddress,
        campaignForm.title,
        ethers.utils.parseEther(campaignForm.target),
        campaignForm.videoAddress,
        campaignForm.deadLine,
        campaignForm.description
      );
      await transaction.wait();
      console.log("Campaign created successfully!");
    } catch (error) {
      console.log("Error creating campaign:", error);
    }
  };

  

  return (
    <>
      <Nav />
      <section className="create-campaign-form">
        <div className="container">
          <form className="contact-form">
            <div className="row">
              <div className="col-12">
                <div className="section-title text-center">
                  <p>
                    <span></span>
                    ANYTHING ON YOUR MIND
                  </p>
                  <h1>Create Your Campaign</h1>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-user"></i>
                  <input
                    name="address"
                    type="text"
                    placeholder="Input your Wallet Address"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-image"></i>
                  <input
                    name="imgAddress"
                    type="text"
                    placeholder="Input your Cover image address"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-heading"></i>
                  <input
                    name="title"
                    type="text"
                    placeholder="Your Campaign Title"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-bullseye"></i>
                  <input
                    name="target"
                    type="text"
                    placeholder="Your target"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-brands fa-youtube"></i>
                  <input
                    name="videoAddress"
                    type="text"
                    placeholder="video description address"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i className="fa-solid fa-calendar"></i>
                  <input
                    name="deadLine"
                    type="text"
                    placeholder="enter your deadline"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box-text ">
                  <i className="fa-solid fa-comment form-box-text-logo"></i>
                  <textarea
                    name="description"
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Enter description for your Campaign"
                    onChange={(e) => {
                      handleForm(e, e.target.name);
                    }}
                  ></textarea>
                </div>
              </div>
              <div className="contact-btn text-center">
                <button className="btn" onClick={submitForm}>
                  Create your Campaign
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateCampaign;
