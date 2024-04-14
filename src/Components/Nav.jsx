import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../Reducer/AppContext";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import MyContractArtifact from "../../../backend/artifacts/contracts/Contract.sol/MyContract.json";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/Logo/logo.svg";

const Nav = () => {
  const { state, dispatch } = useContext(AppContext);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;
  const [signer, setSigner] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = ethers.utils.getAddress(accounts[0]);
        const Signer = provider.getSigner();
        if (Signer) {
          setSigner(Signer);
          dispatch({type:'GET_SIGNER',payload:signer})
          const contractinstance = new ethers.Contract(contractAddress, MyContractArtifact.abi, signer);
          if(contractinstance){
            setContractInstance(contractinstance);
            dispatch({type:'GET_CONTRACT',payload:contractInstance})
            console.log('state',state)
          }
        } else {
          console.error("No signer available");
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected the connection request.");
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid nav-container">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {state.signer && (
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/supportcampaigns" className="nav-link">
                  Support a Campaign
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/createcampaign" className="nav-link">
                  Create a Campaign
                </Link>
              </li>
            </ul>
          </div>
        )}
        <button className="connect-button" onClick={connectWallet}>
          {state.signer ? `Connected` : "Connect to Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
