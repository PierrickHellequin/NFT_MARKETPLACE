import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("http://ipfs.infura.io:5001/api/v0");

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [royalty, setRoyalty] = useState(0);

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setImage("https://ipfs.infura.io/ipfs/"+result.path);
      } catch (error) {
        console.log("ipfs image upload error ");
      }
    }
  };

  const createNFT = async () => {
    if (!image || !name || !description || !price) return;
    try {
      const result = await client.add(
        JSON.stringify({ image, name, description })
      );
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri error: ", error);
    }
  };

  const mintThenList = async (result) => {
    const uri = "https://ipfs.infura.io/ipfs/"+result.path;
    //mint nft
    await (await nft.mint(uri, royalty)).wait();
    // get token of the new nft
    const tokenID = await nft.tokenCount();
    //approval the marketplace
    await (await nft.setApprovalForAll(marketplace.address, tokenID)).wait();
    //add nft to the marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, tokenID, listingPrice, royalty)).wait();
  };

  return (
      <div className="row">
        <main
          role="main"
          className="col-lg-12 mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                required
                as="textarea"
                placeholder="Description"
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                required
                type="number"
                placeholder="Price in ETH"
              />
              <Form.Control
                onChange={(e) => setRoyalty(e.target.value)}
                size="lg"
                type="number"
                placeholder="Royalty : Maximum 10%"
              />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
  );
};

export default Create;
