import React, {useEffect, useState} from "react";
import { connect } from "@argent/get-starknet";
import { Abi, Contract, uint256} from "starknet";
import "./App.css";
import abi from "./utils/claim.json";
import twitterLogo from "./assets/twitter-logo.svg"

const getStarknetObject = () => window.starknet;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findStarknetAccount = async () => {
	try {
		const starknet = getStarknetObject();

		/*
		 * First make sure we have access to the Ethereum object.
		 */
		if (!starknet) {
			console.error("Make sure you have Argent!");
			return null;
		}

		console.log("We have the Argent object", starknet);
		const accounts = starknet.account;

		if (accounts.length !== 0) {
			const account = accounts.address;
			console.log("Found an authorized account:", account);
			return account;
		} else {
			console.error("No authorized account found");
			return null;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
};

const App = () => {
	const [currentAccount, setCurrentAccount] = useState("");
	const [isMining, setIsMining] = useState(false);
	const [value, setValue] = useState();
	//const [end, setEnd] = useState(200);
	const [changes, setChange] = useState("");

	const contractAddress = "0x06fba4abcca41b2ae445f6c97d1da9e71567a560be908bc2df7606635c9057f8";
	const abi = abi.abi;
  const [owner, setOwner] = useState("");

	const connectWallet = async () => {
		try {
			const starknet = getStarknetObject();
			if (!starknet) {
				alert("Get Argent Wallet!");
				return;
			}

      await starknet.enable();
			const account = starknet.account;

			console.log("Connected", account.address);
			setCurrentAccount(account.address);
		} catch (error) {
			console.error(error);
		}
	};

	const call = async () => {
		try {
			const {starknet} = window;

			if (starknet) {
				const signer = starknet.account;
				const callContract = new Contract(abi, contractAddress, signer);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.mint({
					value: ethers.utils.parseEther("0.00")
				});
        setIsMing(true);
				console.log("Mining...", callTxn.hash);

				await callTxn.wait();
				console.log("Mined -- ", callTxn.hash);
        setIsMing(false);
				console.log("Minted successfully");
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	/*
	 * This runs our function when the page loads.
	 * More technically, when the App component "mounts".
	 */
	useEffect(async () => {
		const account = await findStarknetAccount();
		if (account !== null) {
			setCurrentAccount(account);
      console.log('account in useEffect', account)
      if (starknet) {
    		const signer = starknet.account;
        // setOwner(await callContract.getOwner());
      }
		}
	}, []);

	return (
		<div className="App">
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Starknet Sample Dapp
        </div>

        <div className="bio">
          This is a sample dapp build on starknet, sample for call and multicall. Available on testnet
        </div>

        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="callButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {/*{currentAccount && (
          <div className="bio">
          Connected Address: {currentAccount}
        </div>
        )}*/}
        
        {isMining ? (<div className="grid-container"><span className="loading">Mining</span></div>) : (
					<div className="grid-container">
						<span className="grid-item">
              args for contranct #1：
            </span>
						<input type="text" value={value} placeholder = '100' style={{borderRadius:'4px',border:'none'}} onChange={a=>{setValue(a.target.value)}} />
				</div>)}
        
				<button className="callButton" onClick={call}> 
          Call
        </button>

        <br></br>

        <div className="grid-container">
						<span className="grid-item">
              args for contranct #2：
            </span>
						<input type="text" value={value} placeholder = '100' style={{borderRadius:'4px',border:'none'}} onChange={a=>{setValue(a.target.value)}} />
				</div>

        <button className="callButton" onClick={call}> 
          Call
        </button>

        <br></br>
        
        <button className="callButton" onClick={call}> 
          multiCall
        </button>

        <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href="https://twitter.com/kongtaoxing"
						target="_blank"
						rel="noreferrer"
					>{`built by @kongtaoxing`}</a>
				</div>

      </div>
    </div>
  </div>
	);
};

export default App;