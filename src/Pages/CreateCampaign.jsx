import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import Nav from "../Components/Nav";

const CreateCampaign = () => {
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
                  <i class="fa-solid fa-user"></i>
                  <input type="text" placeholder="Input your Wallet Address" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                  <i class="fa-solid fa-envelope"></i>
                  <input type="email" placeholder="Your email address" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                <i class="fa-solid fa-image"></i>
                  <input type="text" placeholder="Input your Cover image address" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                <i class="fa-solid fa-heading"></i>
                  <input type="text" placeholder="Your Campaign Title" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                <i class="fa-solid fa-bullseye"></i>
                  <input type="text" placeholder="Your target" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                <i class="fa-brands fa-youtube"></i>
                  <input type="text" placeholder="video description address" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-box user-icon mb-30">
                <i class="fa-solid fa-calendar"></i>
                  <input type="text" placeholder="enter your deadline" />
                </div>
              </div>
              <div className="col-12">
                <div className="form-box-text ">
                <i class="fa-solid fa-comment form-box-text-logo"></i>
                  <textarea name="" id="" cols="30" rows="10" placeholder="Enter description for your Campaign"></textarea>
                </div>
              </div>
              <div className="contact-btn text-center">
                <button className="btn">
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
