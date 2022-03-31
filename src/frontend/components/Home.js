import { useState, useEffect } from "react";
import HomeSlider from "./homeSlider.js";
import Items from "./items.js";

const Home = ({ marketplace, nft }) => {
  let filters = {"functions" : "loadMarketplaceItems"};

  return (
    <>
      <HomeSlider />
      <div className="flex justify-center" style={{ background: "#212428" }}>
        <div className="col-lg-12">
          <h2 className="style-2 px-10" style={{ color: "#ffffff" }}>
            New Items
          </h2>
        </div>
        <Items marketplace={marketplace} nft={nft} filters={filters} />
      </div>
    </>
  );
};
export default Home;
