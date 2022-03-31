import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'
import Items from "./items.js";

export default function MyListedItems({ marketplace, nft, account }) {
  
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])



  let filters = {"functions" : "MyListedItems"};

  return (
    <div className="flex justify-center">
      <Items marketplace={marketplace} nft={nft} filters={filters} account={account}/>
    </div>
  );
}