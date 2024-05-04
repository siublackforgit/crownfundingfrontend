import { React, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Nav from "../Components/Nav";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { AppContext } from "../Reducer/AppContext";

const CreateCampaign = () => {
  // browser signer
  const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
  const browserSigner = browserProvider.getSigner();

  const { state, blockState, blockDispatch } = useContext(AppContext);

  const now = new Date();
  const today = new Date();  
  now.setMinutes(now.getMinutes() + 10); 

  const [selectDate, setSelectDate] = useState(now);

  const [signerAddress,setSignerAddress] = useState(null);

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

  useEffect(()=>{
    console.log('stateeeeeeee',state)
    const getAddress = async () => {
      try {
        const address = await browserSigner.getAddress();
        setSignerAddress(address);
        console.log('signer address',signerAddress);
      } catch (error) {
        console.error("Error retrieving signer address:", error);
        return null;
      }
    };
    
    // Call this function to log the address
    getAddress();
  },[browserProvider])

  useEffect(() => {
    if (selectDate) { 
      console.log('selecte Date',selectDate)
        const unixTimestamp = Math.floor(selectDate.getTime() / 1000);
        console.log('Unix Timestamp:', unixTimestamp);
        setCampaignForm((prev)=>({
          ...prev,
          deadLine: unixTimestamp,
        }))
    }
}, [selectDate]); // Dependency array

  const handleForm = (e, keyWords) => {
    setCampaignForm((prev) => ({
      ...prev,
      [keyWords]: e.target.value,
    }));
  };

  const handleDateForm = (date) => {
    setSelectDate(date);
  }

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("form", campaignForm);
    console.log('state check',state)
    try {    
      const transaction = await state.contract.createCampaign(
        campaignForm.address,
        signerAddress,
        campaignForm.email,
        campaignForm.imgAddress,
        campaignForm.title,
        ethers.utils.parseEther(campaignForm.target),
        campaignForm.videoAddress,
        campaignForm.deadLine,
        campaignForm.description
      );
      const succeedTransaction = await transaction.wait();
      // blockDispatch({type:'ADD_BLOCK', payload: succeedTransaction})
      alert("Campaign created successfully!");
    } catch (error) {
      console.log("Error creating campaign:", error);
    }
  };

  const getMinTime = () => {
    const now = new Date();
    if (selectDate.toDateString() === now.toDateString()) {
      return now;
    }
    return new Date(now.setHours(0, 0, 0, 0));
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
                    placeholder="Please Enter Your Target in ethers"
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
                      <DatePicker 
                      selected={selectDate} 
                      minDate={today}
                      onChange={handleDateForm}
                      timeFormat="HH:mm" 
                      showTimeSelect
                      timeIntervals={5}
                      minTime={getMinTime()}
                      maxTime={new Date().setHours(23, 55, 0, 0)} 
                      dateFormat="MMMM d, yyyy HH:mm" 
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
