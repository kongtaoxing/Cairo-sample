import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import "./App.css";
import abi from "./utils/claim.json";
import twitterLogo from "./assets/twitter-logo.svg"

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
	try {
		const ethereum = getEthereumObject();

		/*
		 * First make sure we have access to the Ethereum object.
		 */
		if (!ethereum) {
			console.error("Make sure you have Metamask!");
			return null;
		}

		console.log("We have the Ethereum object", ethereum);
		const accounts = await ethereum.request({
			method: "eth_accounts"
		});

		if (accounts.length !== 0) {
			const account = accounts[0];
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

	const contractAddress = "0x6797bc206AF7D06ffb8724d079fb0FB4Bc37c0cD";
	const contractABI = abi.abi;
  const [owner, setOwner] = useState("");

	const connectWallet = async () => {
		try {
			const ethereum = getEthereumObject();
			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.error(error);
		}
	};

	const _mint = async () => {
		try {
			const {
				ethereum
			} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const callContract = new ethers.Contract(contractAddress, contractABI, signer);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.call(value, {
					value: ethers.utils.parseEther("0.001")
				});
				console.log("Mining...", callTxn.hash);

				await callTxn.wait();
				console.log("Mined -- ", callTxn.hash);

				count = await callContract.getOwner();
				console.log("Minted successfully");
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const _getOwner = async () => {
		try {
			const {
				ethereum
			} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const callContract = new ethers.Contract(contractAddress, contractABI, signer);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.getOwner();
				console.log("The owner is ", callTxn);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const changeOwner = async () => {
		console.log(currentAccount);
		try {
			const {
				ethereum
			} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const callContract = new ethers.Contract(contractAddress, contractABI, signer);

				owner = await callContract.getOwner();
				console.log("The owner of the contract is:", owner);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.changeOwner(changes);
				console.log("Mining...", callTxn.hash);

				await callTxn.wait();
				console.log("Mined -- ", callTxn.hash);

				count = await callContract.getOwner();
				console.log("The owner of the contract is:", owner);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const withdraw = async () => {
		try {
			const {
				ethereum
			} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const callContract = new ethers.Contract(contractAddress, contractABI, signer);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.withdraw();
				console.log("Mining...", callTxn.hash);

				await callTxn.wait();
				console.log("Mined -- ", callTxn.hash);

				count = await callContract.getOwner();
				console.log("Withdrew successfully");
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

	const destroy = async () => {
		try {
			const {
				ethereum
			} = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const callContract = new ethers.Contract(contractAddress, contractABI, signer);

				/*
				 * Execute the actual call from your smart contract
				 */
				const callTxn = await callContract.destr();
				console.log("Mining...", callTxn.hash);

				await callTxn.wait();
				console.log("Mined -- ", callTxn.hash);

				count = await callContract.getOwner();
				console.log("Withdrew successfully");
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
		const account = await findMetaMaskAccount();
		if (account !== null) {
			setCurrentAccount(account);
      if (ethereum) {
    		const provider = new ethers.providers.Web3Provider(ethereum);
    		const signer = provider.getSigner();
    		const callContract = new ethers.Contract(contractAddress, contractABI, signer);
        setOwner(await callContract.getOwner());
      }
		}
	}, []);

	return (
		<div className="App">
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          🌿一键薄荷🌿
        </div>

        <div className="bio">
          批量mint脚本，输入数量之后点击Mint即可，喜欢的话欢迎关注我的推特
        </div>

        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="callButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
        {isMining ? (<div className="grid-container"><span className="loading">Mining</span></div>) : (
					<div className="grid-container">
						<span className="grid-item">
              请输入想要mint的数量：
            </span>
						<input type="text" value={value} placeholder = '100' style={{borderRadius:'4px',border:'none'}} onChange={a=>{setValue(a.target.value)}} />
				</div>)}

        {/*
        {isMining ? (<div className="grid-container"><span className="loading">Mining</span></div>) : (
					<div className="grid-container">
						<span className="grid-item">
              请输入截止的编号：
            </span>
						<input type="text" style={{borderRadius:'4px',border:'none'}} onChange={a=>{setEnd(a.target.value)}} />
				</div>)}
        */}
        
				<button className="callButton" onClick={_mint}> 
          Mint 
        </button>
        
        {(currentAccount  == owner.toLowerCase())&&(<div className="grid-container">
						<span className="grid-item">
              请输入新owner地址: 
            </span>
						<input type="text" value={changes} placeholder = "0x0000000000000000000000000000000000000000" style={{borderRadius:'4px',border:'none'}} onChange={a=>{setChange(a.target.value)}} />
				  </div>)}
        
        {(currentAccount == owner.toLowerCase()) && (
          <button className="callButton" onClick={changeOwner}>
            Change Owner
          </button>
        )}

        {(currentAccount  == owner.toLowerCase()) && (
          <button className="callButton" onClick={_getOwner}>
            Get Owner
          </button>
        )}

        {(currentAccount  == owner.toLowerCase()) && (
          <button className="callButton" onClick={withdraw}>
            Withdraw
          </button>
        )}
        
        {(currentAccount  == owner.toLowerCase()) && (
          <button className="callButton" onClick={destroy}>
            Destroy Contract Manually
          </button>
        )}

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