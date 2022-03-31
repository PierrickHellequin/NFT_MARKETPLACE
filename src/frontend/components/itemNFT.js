import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import ethLogo from '../assets/img/eth-logo.png'

export default function ItemNFT({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [nftID, setNftId] = useState(0);
  const [nftData, setNFTData] = useState({
    itemId: 0,
    price: 0,
    totalPrice: 0,
    metadata: [],
  });
  const { id } = useParams();

  const loadListedItem = async () => {
    if (id == 0) {
      return;
    }
    const i = await marketplace.items(id);
    // get uri url from nft contract
    const uri = await nft.tokenURI(i.tokenID);
    // use uri to fetch the nft metadata stored on ipfs
    const response = await fetch(uri);
    const metadata = await response.json();
    // get total price of item (item price + fee)
    const totalPrice = await marketplace.getTotalPrice(i.itemId);
    // define listed item object
    console.log(i);
    setNFTData({
      creator: i.creator.slice(0, 5) + "..." + i.creator.slice(38, 42),
      owner: i.nftOwner.slice(0, 5) + "..." + i.nftOwner.slice(38, 42),
      itemId: i.itemId,
      totalPrice: ethers.utils.formatEther(totalPrice),
      price: ethers.utils.formatEther(i.price),
      metadata: metadata,
      sold: i.sold
    });
    setLoading(false);
  };

  useEffect(() => {
    loadListedItem();
  }, []);

  return (
    <section
      aria-label="section"
      className="mt90 sm-mt-0"
      style={{ backgroundSize: "cover" }}
    >
      <div className="container" style={{ backgroundSize: "cover" }}>
        <div className="row" style={{ backgroundSize: "cover" }}>
          <div
            className="col-md-6 text-center"
            style={{ backgroundSize: "cover" }}
          >
            <img
              src={nftData.metadata.image}
              className="img-fluid img-rounded mb-sm-30"
            />
          </div>
          <div className="col-md-6" style={{ backgroundSize: "cover" }}>
            <div className="item_info" style={{ backgroundSize: "cover" }}>
              <h2>{nftData.metadata.name}</h2>

              <p>{nftData.metadata.description}</p>

              <div
                className="d-flex flex-row"
                style={{ backgroundSize: "cover" }}
              >
                <div className="mr40" style={{ backgroundSize: "cover" }}>
                  <h6>Creator</h6>
                  <div
                    className="item_author"
                    style={{ backgroundSize: "cover" }}
                  >
                    <div
                      className="author_list_pp"
                      style={{ backgroundSize: "cover" }}
                    >
                      <a href="03_grey-author.html">
                        <img
                          className="lazy"
                          src="images/author/author-1.jpg"
                        />
                        <i className="fa fa-check"></i>
                      </a>
                    </div>
                    <div
                      className="author_list_info"
                      style={{ backgroundSize: "cover" }}
                    >
                      <a href="03_grey-author.html">{nftData.creator}</a>
                    </div>
                  </div>
                </div>
                {/* <div style={{ backgroundSize: "cover" }}>
                  <h6>Collection</h6>
                  <div
                    className="item_author"
                    style={{ backgroundSize: "cover" }}
                  >
                    <div
                      className="author_list_pp"
                      style={{ backgroundSize: "cover" }}
                    >
                      <a href="03_grey-collection.html">
                        <img
                          className="lazy"
                          src="images/collections/coll-thumbnail-1.jpg"
                        />
                        <i className="fa fa-check"></i>
                      </a>
                    </div>
                    <div
                      className="author_list_info"
                      style={{ backgroundSize: "cover" }}
                    >
                      <a href="03_grey-collection.html">AnimeSailorClub</a>
                    </div>
                  </div>
                </div> */}
              </div>

              <div
                className="spacer-40"
                style={{ backgroundSize: "cover" }}
              ></div>

              <div
                className="de_tab tab_simple"
                style={{ backgroundSize: "cover" }}
              >
                <ul className="de_nav">
                  <li className="active">
                    <span>Details</span>
                  </li>
                  <li>
                    <span>Bids</span>
                  </li>
                  <li>
                    <span>History</span>
                  </li>
                </ul>
                <div
                  className="de_tab_content"
                  style={{ backgroundSize: "cover" }}
                >
                  <div className="tab-1" style={{ backgroundSize: "cover" }}>
                    <h6>Owner</h6>
                    <div
                      className="item_author"
                      style={{ backgroundSize: "cover" }}
                    >
                      <div
                        className="author_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-10.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="author_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">Stacy Long</a>
                      </div>
                    </div>

                    <div
                      className="spacer-40"
                      style={{ backgroundSize: "cover" }}
                    ></div>
                    <h6>Properties</h6>
                    <div
                      className="row gx-2"
                      style={{ backgroundSize: "cover" }}
                    >
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Background</h5>
                          <h4>Yellowish Sky</h4>
                          <span>85% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Eyes</h5>
                          <h4>Purple Eyes</h4>
                          <span>14% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Nose</h5>
                          <h4>Small Nose</h4>
                          <span>45% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Mouth</h5>
                          <h4>Smile Red Lip</h4>
                          <span>61% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Neck</h5>
                          <h4>Pink Ribbon</h4>
                          <span>27% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Hair</h5>
                          <h4>Pink Short</h4>
                          <span>35% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Accessories</h5>
                          <h4>Heart Necklace</h4>
                          <span>33% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Hat</h5>
                          <h4>Cute Panda</h4>
                          <span>62% have this trait</span>
                        </a>
                      </div>
                      <div
                        className="col-lg-4 col-md-6 col-sm-6"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="#" className="nft_attr">
                          <h5>Clothes</h5>
                          <h4>Casual Purple</h4>
                          <span>78% have this trait</span>
                        </a>
                      </div>
                    </div>
                    <div
                      className="spacer-30"
                      style={{ backgroundSize: "cover" }}
                    ></div>
                  </div>

                  <div
                    className="tab-2"
                    style={{ backgroundSize: "cover", display: "none" }}
                  >
                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-1.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid accepted <b>0.005 ETH</b>
                        <span>
                          by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-2.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.005 ETH</b>
                        <span>
                          by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-3.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.004 ETH</b>
                        <span>
                          by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-4.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.003 ETH</b>
                        <span>
                          by <b>Lori Hart</b> at 6/12/2021, 12:57 AM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-3"
                    style={{ backgroundSize: "cover", display: "none" }}
                  >
                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-5.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.005 ETH</b>
                        <span>
                          by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-1.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid accepted <b>0.005 ETH</b>
                        <span>
                          by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-2.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.005 ETH</b>
                        <span>
                          by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-3.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.004 ETH</b>
                        <span>
                          by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM
                        </span>
                      </div>
                    </div>

                    <div className="p_list" style={{ backgroundSize: "cover" }}>
                      <div
                        className="p_list_pp"
                        style={{ backgroundSize: "cover" }}
                      >
                        <a href="03_grey-author.html">
                          <img
                            className="lazy"
                            src="images/author/author-4.jpg"
                          />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div
                        className="p_list_info"
                        style={{ backgroundSize: "cover" }}
                      >
                        Bid <b>0.003 ETH</b>
                        <span>
                          by <b>Lori Hart</b> at 6/12/2021, 12:57 AM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="spacer-10"
                  style={{ backgroundSize: "cover" }}
                ></div>
                <h6>Price</h6>
                <div
                  className="nft-item-price"
                  style={{ backgroundSize: "cover" }}
                >
                  <img src={ethLogo} style={{width:"5%"}}/>
                  <span> {nftData.totalPrice}</span>($253.67)
                </div>
                <a
                  href="#"
                  className="btn-main btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#buy_now"
                >
                  Buy Now
                </a>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
