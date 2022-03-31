import React, { Component } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
class Items extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      marketplace: {},
      nft: {},
      loading: true,
      filters: {},
      postsPerPage: 4,
      next: 0,
      arrayForHoldingPosts: [],
      account: "",
    };
  }
  componentDidMount = () =>{
    this.setState({
        marketplace: this.props.marketplace,
        nft: this.props.nft,
        filters: this.props.filters,
        account: this.props.account,
      }); 
    this.loadMarketplaceItems();
  }
  componentDidUpdate = (prevProps) => {

    if (
      prevProps == undefined ||
      this.props.filters !== prevProps.filters
    ) {
      this.setState({
        marketplace: this.props.marketplace,
        nft: this.props.nft,
        filters: this.props.filters,
        account: this.props.account,
      });
      this.loadMarketplaceItems();
    }
  };

  loadMarketplaceItems = async () => {
    // Load all unsold items
   
    const itemCount = await this.props.marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await this.props.marketplace.items(i);
      switch (this.props.filters.functions) {
        case "loadMarketplaceItems":
          if (item.sold == true) {
            continue;
          }
          break;
        case "MyListedItems":
    
          if (item.nftOwner.toLowerCase() !== this.state.account) {
            continue;
          }
          break;
        default:
          break;
      }

      // get uri url from nft contract
      const uri = await this.props.nft.tokenURI(item.tokenID);
      // use uri to fetch the nft metadata stored on ipfs
      const response = await fetch(uri);
      const metadata = await response.json();
      // get total price of item (item price + fee)
      const totalPrice = await this.props.marketplace.getTotalPrice(
        item.itemId
      );
      // Add item to items array
      items.push({
        totalPrice,
        itemId: item.itemId,
        seller: item.seller,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
      });
    }

 

    this.setState({ loading: false, items: items });
    this.handleShowMorePosts();
  };

  buyMarketItem = async (item) => {
    await (
      await this.marketplace.purchaseItem(item.itemId, {
        value: item.totalPrice,
      })
    ).wait();
    this.loadMarketplaceItems();
  };

  loopWithSlice = (start, end) => {
    let slicedPosts = this.state.items.slice(start, end);
    let arrayForHoldingPosts = [
      ...this.state.arrayForHoldingPosts,
      ...slicedPosts,
    ];
    this.setState({ arrayForHoldingPosts });
  };

  handleShowMorePosts = () => {
    this.loopWithSlice(
      this.state.next,
      this.state.next + this.state.postsPerPage
    );
    this.setState({ next: this.state.next + this.state.postsPerPage });
  };

  render() {

    return this.state.arrayForHoldingPosts.length > 0 ? (
      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {this.state.arrayForHoldingPosts.map((item, idx) => (
            <div
              key={idx}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <Link
                to={{
                  pathname: `/itemNFT/${item.itemId}`,
                  state: { fromDashboard: true },
                  query: { id: item.itemId, state: "test" },
                }}
              >
                <div
                  className="nft__item style-2"
                  style={{ backgroundSize: "cover", background: "#212428" }}
                >
                  <div
                    className="nft__item_wrap"
                    style={{ backgroundSize: "cover", height: "266px" }}
                  >
                    <img src={item.image} className="lazy nft__item_preview" />
                  </div>
                  <div
                    className="nft__item_info"
                    style={{ backgroundSize: "cover" }}
                  >
                    <h4>{item.name}</h4>

                    <div
                      className="nft__item_click"
                      style={{ backgroundSize: "cover" }}
                    >
                      <span></span>
                    </div>
                    <div
                      className="nft__item_price"
                      style={{ backgroundSize: "cover" }}
                    >
                      {ethers.utils.formatEther(item.totalPrice)} ETH
                    </div>
                    <div
                      className="nft__item_action"
                      style={{ backgroundSize: "cover" }}
                    >
                      <a href="#">Buy</a>
                    </div>
                    <div
                      className="nft__item_like"
                      style={{ backgroundSize: "cover" }}
                    >
                      <i className="fa fa-heart"></i>
                      <span>50</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Row>

        <button onClick={this.handleShowMorePosts}>Load more</button>
      </div>
    ) : (
      <main style={{ padding: "1rem 0" }}>
        <h2>No listed assets</h2>
      </main>
    );
  }
}

export default Items;
