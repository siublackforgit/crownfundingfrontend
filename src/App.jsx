import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyContractArtifact from '../../backend/contracts/artifacts/MyContract.json';
import './App.css'

const myContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const endPoint = import.meta.env.VITE_LOCAL_BLOCKCHAIN_ENDPOINT;

function App() {
  const [myNumber, setMyNumber] = useState(0);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(endPoint);
    const myContract = new ethers.Contract(myContractAddress,MyContractArtifact.abi, provider);
    const getMyNumber = async () => {
      try {
        const number = await myContract.displayBackerCampaigns();
        console.log('here');
      } catch (error) {
        console.log('error',error);
      }
    }

    getMyNumber();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Current Block Number:</p>
      </header>
    </div>
  );
}

export default App
