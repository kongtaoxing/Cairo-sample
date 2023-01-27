import React, {useEffect, useState} from "react";
// import { connect } from "@argent/get-starknet";
import { stark, Contract, uint256} from "starknet";
import "./App.css";
import abi_1 from "./utils/contract_1.json";
import abi_2 from "./utils/contract_2.json";
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
		 * First make sure we have access to the Starknet object.
		 */
		if (!starknet) {
			console.error("Make sure you have Argent!");
			return null;
		}

		console.log("We have the Argent object", starknet);
		const accounts = starknet.account;

		if (accounts.address.length !== 0) {
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
	const [value1, setValue1] = useState("");
	const [value2, setValue2] = useState("");

  const contractAddress_1 = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
	const contractAddress_2 = "0x15e90f807a00a01df845460324fbcd33986f2df3cc9d981e9e8b5005b7f595e";
  const [owner, setOwner] = useState("");
  // 1000000000000000 wei is 0.001Ether

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

  const call_1 = async () => {
		try {
			const {starknet} = window;

			if (starknet) {
				const signer = starknet.account;
				const callContract = new Contract(abi_1.abi, contractAddress_1, signer);
        // console.log(uint256.bnToUint256(value1));

        // cal contract from signer
        const callTx = await signer.execute(
          {
            contractAddress: contractAddress_1,
            entrypoint: "approve", 
            calldata: 
              // Use a simple array to display data
              // [contractAddress_2, value1, '0'] 

              // Use compileCalldata to display data
              stark.compileCalldata({
                spender: contractAddress_2,
                amount: {type: 'struct', low: value1, high: '0'},
              })
          },
          undefined,  // This part is for contract abi
          {
            // maxFee: 888888888888888888,
            // version: '2',
            nonce: '101',  // or just user int 101 is ok
          }
        );

        // call contract from contract
				// const callTx = await callContract.approve(contractAddress_2, [value1, '0']);
        await signer.waitForTransaction(callTx.transaction_hash);
        console.log('Txn hash is:', callTx.transaction_hash);
			} else {
				console.log("Starknet object doesn't exist!");
			}
		} catch (error) {
			console.error(error);
		}
	}
  
	const call_2 = async () => {
		try {
			const {starknet} = window;

			if (starknet) {
				const signer = starknet.account;
				const callContract = new Contract(abi_2.abi, contractAddress_2, signer);
				const callTx = await callContract.transfer_ether([value1, '0']);
        
        // const callTx = await signer.execute({
        //   contractAddress: contractAddress_2,
        //   entrypoint: "transfer_ether",
        //   calldata: [value1, '0']
        // },
        //   undefined,  // This part is for contract abi
        //   {
        //     // maxFee: 888888888888888888,
        //     // version: '2',
        //     nonce: '101'
        //   });
        await signer.waitForTransaction(callTx.transaction_hash);
        console.log('Txn hash is:', callTx.transaction_hash);
			} else {
				console.log("Starknet object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	}

  const multiCall = async () => {
		try {
			const {starknet} = window;

			if (starknet) {
				const signer = starknet.account;
				const callContract = new Contract(abi_2.abi, contractAddress_2, signer);

        // multicall data
        // const call = {contractAddress: `0x06a05844a03bb9e744479e3298f54705a35966ab04140d3d8dd797c1f6dc49d0`,
        //              entrypoint: 'evolve',
        //              calldata: ['0x7300100008000000000000000000000000']
        //              };
        // const call_string = JSON.stringify(call) + ',';
        // const call_raw = '[' + call_string.repeat(value2) + ']';

        // const transfer_ether = [
        //     {
        //       contractAddress: contractAddress_1,
        //       entrypoint: 'transfer',
        //       calldata: ['0x0746f97FbD3C65916Ee7024Bf5a6cF6a813aab13dC7793633D7159508170A84E', String(40000000000000 * eval(value2)), '0']
        //     }];
        // const callData = eval(call_raw).concat(transfer_ether);
        // multicall data
				const callTx = await signer.execute(
          [{
            contractAddress: contractAddress_1,
            entrypoint: "approve", 
            calldata: 
              // [contractAddress_2, value1, '0'] // Use a simple array to display data
              stark.compileCalldata({
                spender: contractAddress_2,
                amount: {type: 'struct', low: value1, high: '0'},
              })
          },
          {
            contractAddress: contractAddress_2,
            entrypoint: "transfer_ether",
            calldata: [value1, '0']
            //   stark.compileCalldata({
            //   amount: {type: 'struct', low: value1, high: '0'},
            // })
          }]
        );
        await signer.waitForTransaction(callTx.transaction_hash);
        console.log('Txn hash is:', callTx.transaction_hash);
			} else {
				console.log("Starknet object doesn't exist!");
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
      // console.log('account in useEffect', account)
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
						<input type="text" value={value1} placeholder = '100' style={{borderRadius:'4px',border:'none'}} onChange={a=>{setValue1(a.target.value)}} />
				</div>)}
        
				<button className="callButton" onClick={call_1}> 
          Call
        </button>

        <br></br>

        <div className="grid-container">
						<span className="grid-item">
              args for contranct #2：
            </span>
						<input type="text" value={value2} placeholder = '100' style={{borderRadius:'4px',border:'none'}} onChange={a=>{setValue2(a.target.value)}} />
				</div>

        <button className="callButton" onClick={call_2}> 
          Call
        </button>

        <br></br>
        
        <button className="callButton" onClick={multiCall}> 
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