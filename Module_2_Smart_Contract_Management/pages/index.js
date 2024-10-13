import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerError, setOwnerError] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [author, setAuthor] = useState("");
  const [downloads, setDownloads] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with your contract address
  const atmABI = atm_abi.abi;

  // Load wallet and monitor account changes
  useEffect(() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      getWallet();
    } else {
      console.log("Please install MetaMask!");
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  // Set up contract interaction when wallet/account changes
  useEffect(() => {
    if (ethWallet && account) {
      getATMContract();
    }
  }, [ethWallet, account]);

  // Fetch MetaMask wallet accounts
  const getWallet = async () => {
    if (ethWallet) {
      try {
        const accounts = await ethWallet.request({ method: "eth_accounts" });
        handleAccount(accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }
  };

  // Handle account changes
  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  // Connect MetaMask account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  // Set up ATM contract and fetch initial data
  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
    fetchFiles(atmContract);
    getBalance(); // Fetch balance on contract initialization
  };

  // Fetch contract balance
  const getBalance = async () => {
    if (atm) {
      try {
        const balanceBigNumber = await atm.getBalance();
        setBalance(ethers.utils.formatEther(balanceBigNumber));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  // Transfer contract ownership
  const transferOwnership = async () => {
    if (atm && newOwner) {
      try {
        const tx = await atm.transferOwnership(newOwner);
        await tx.wait();
        alert(`Ownership transferred to ${newOwner}`);
        setNewOwner("");
        checkOwnership(); // Refresh ownership status
      } catch (error) {
        setOwnerError(true);
        setTimeout(() => setOwnerError(false), 5000);
      }
    }
  };

  // Fetch files from the contract
  const fetchFiles = async (contract) => {
    try {
      const fileArray = await contract.getFiles();
      setFiles(
        fileArray.map((file) => ({
          ...file,
          name: file.name,
          size: file.size.toString(), // Convert BigNumber to string for display
          author: file.author,
          totalDownloads: file.totalDownloads.toString(),
        }))
      );
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Add a new file to the contract
  const addFile = async () => {
    if (atm && fileName && fileSize && author && downloads) {
      try {
        const tx = await atm.addFile(fileName, parseInt(fileSize, 10), author, parseInt(downloads, 10));
        await tx.wait();
        alert(`File ${fileName} added successfully!`);
        fetchFiles(atm); // Refresh file list after adding
        setFileName("");
        setFileSize("");
        setAuthor("");
        setDownloads("");
      } catch (error) {
        console.error("Error adding file:", error);
      }
    }
  };

  // Remove a file from the contract
  const removeFile = async (index) => {
    if (atm) {
      try {
        const tx = await atm.removeFile(index);
        await tx.wait();
        alert("File removed successfully!");
        fetchFiles(atm); // Refresh file list after removing
      } catch (error) {
        console.error("Error removing file:", error);
      }
    }
  };

  // Deposit ETH into the contract
  const deposit = async () => {
    if (atm && depositAmount) {
      try {
        const tx = await atm.deposit(ethers.utils.parseEther(depositAmount));
        await tx.wait();
        alert("Deposit successful!");
        setDepositAmount("");
        getBalance(); // Refresh balance after deposit
      } catch (error) {
        console.error("Error depositing funds:", error);
      }
    }
  };

  // Withdraw ETH from the contract
  const withdraw = async () => {
    if (atm && withdrawAmount) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther(withdrawAmount));
        await tx.wait();
        alert("Withdrawal successful!");
        setWithdrawAmount("");
        getBalance(); // Refresh balance after withdrawal
      } catch (error) {
        console.error("Error withdrawing funds:", error);
      }
    }
  };

  // Handle account changes from MetaMask
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else {
      setAccount(accounts[0]);
    }
  };

  // Render appropriate user interface based on wallet status
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this Dapp.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount} className="btn-connect">Please connect your wallet</button>;
    }

    return (
      <div>
        <p>Account Address: {account}</p>
        <button onClick={transferOwnership} className="btn-action">Change Owner</button>
        <input
          type="text"
          placeholder="New owner address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          className="input-text"
        />
        {ownerError && <p className="error">Error: Unable to change the Owner</p>}

        <div className="section">
          <h3>Deposit</h3>
          <input
            type="number"
            placeholder="Amount in ETH"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="input-text"
          />
          <button onClick={deposit} className="btn-action">Deposit</button>
        </div>

        <div className="section">
          <h3>Withdraw</h3>
          <input
            type="number"
            placeholder="Amount in ETH"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="input-text"
          />
          <button onClick={withdraw} className="btn-action">Withdraw</button>
        </div>

        <div className="section">
          <h3>Upload File in DAPP</h3>
          <input
            type="text"
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="input-text"
          />
          <input
            type="number"
            placeholder="File Size"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
            className="input-text"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-text"
          />
          <input
            type="number"
            placeholder="Downloads"
            value={downloads}
            onChange={(e) => setDownloads(e.target.value)}
            className="input-text"
          />
          <button onClick={addFile} className="btn-action">Add File</button>

          <h4> Upload Files</h4>
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="file-item">
                <p>
                  Name: {file.name}, Size: {file.size} bytes, Author: {file.author}, Downloads: {file.totalDownloads}
                </p>
                <button onClick={() => removeFile(index)} className="btn-remove">Remove File</button>
              </div>
            ))
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <main>
      <header>
        <h1>Assessment Dapp</h1>
      </header>
      {initUser()}
      <section>
        <p><strong>User Balance:</strong> {balance ? `${balance} ETH` : "Loading balance..."}</p>
      </section>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }

        body {
          background-color: #f0f2f5;
          color: #333;
        }

        main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          min-height: 100vh;
        }

        header {
          margin-bottom: 30px;
          text-align: center;
        }

        header h1 {
          font-size: 2.5rem;
          color: #4a90e2;
        }

        section {
          width: 100%;
          max-width: 800px;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .section {
          margin-top: 20px;
        }

        .section h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #4a90e2;
        }

        .input-text {
          width: calc(100% - 10px);
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .btn-action {
          background-color: #4a90e2;
          color: #fff;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }

        .btn-action:hover {
          background-color: #357abd;
        }

        .file-item {
          background-color: #f7f8fa;
          padding: 10px;
          margin-top: 10px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-remove {
          background-color: #ff5c5c;
          color: white;
          padding: 6px 10px;
          font-size: 0.9rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-remove:hover {
          background-color: #d9534f;
        }

        input:focus, button:focus {
          outline: none;
        }

        .error {
          color: red;
          font-size: 0.9rem;
        }

        p {
          font-size: 1rem;
          color: #555;
        }

        strong {
          color: #333;
        }
      `}</style>
    </main>
  );
}
