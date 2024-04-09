import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/Logo/logo.svg";

const Nav = () => {
  const [userAddress, setUserAddress] = useState(null);
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setUserAddress(await signer.getAddress());
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected the connection request.");
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  };
  useEffect(() => {
    console.log("userWallet", userAddress);
  });
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
        {userAddress && (
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
          {userAddress ? `Connected` : "Connect to Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
