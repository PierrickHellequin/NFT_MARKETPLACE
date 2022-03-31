import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../assets/styles/App.css";
import "../assets/styles/menu.css";
import Home from "./Home.js";
import Create from "./Create.js";
import CreateCollection from "./CreateCollection";
import Navigation from "./Navbar";
import MyListedItems from "./MyListedItems.js";
import MyPurchases from "./MyPurchases.js";
import ItemNFT from "./itemNFT.js";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "../contractsData/Marketplace.json";
import MarketplaceAddress from "../contractsData/MARKETPLACE-address.json";
import NFTAbi from "../contractsData/NFT.json";
import NFTAddress from "../contractsData/NFT-address.json";
import { Spinner } from "react-bootstrap";

function App() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState((prevState)=>{
     
      let accountJson = localStorage.getItem("accountStorage");
      let accountSaved = JSON.parse(accountJson);
      return accountSaved || "";
  });
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  console.log(account);

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    // Get provider metamask

    
    loadContracts();
  };

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  window.ethereum.on("accountsChanged", async function (accounts) {
    localStorage.removeItem("accountStorage");
    setAccount(accounts[0]);
    await web3Handler();
    
  });

  const loadContracts = async () => {
    //Set signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Get deployed copy of contract
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  };

  useEffect(() => {
    // storing account
    localStorage.setItem("accountStorage", JSON.stringify(account));
    loadContracts();
  }, [account]);

  return (
    <BrowserRouter>
   
      <Navigation web3Handler={web3Handler} account={account} />
      <div className="greyscheme">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            <Spinner animation="border" style={{ display: "flex" }} />
            <p className="mx-3 my-0">Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Home marketplace={marketplace} nft={nft} />}
            />
            <Route
              path="/create"
              element={<Create marketplace={marketplace} nft={nft} />}
            />
            <Route
              path="/create-collection"
              element={<CreateCollection marketplace={marketplace} nft={nft} />}
            />
            <Route
              path="/my-listed-items"
              element={
                <MyListedItems
                  marketplace={marketplace}
                  nft={nft}
                  account={account}
                />
              }
            />
            <Route
              path="/my-purchases"
              element={
                <MyPurchases
                  marketplace={marketplace}
                  nft={nft}
                  account={account}
                />
              }
            />
            
            <Route
              exact
              path='/itemNFT/:id'
              element={
                <ItemNFT
                marketplace={marketplace}
                nft={nft}
                />
              }
              
            />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
