import React, { Component } from "react";
import backgroundImg from '../assets/img/7.jpg'

class HomeSlider extends Component {
  render() {
    return (
      <section className="pt20 pb20 vh-100" style={{backgroundImage: `url(${backgroundImg})` }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="spacer-single"></div>
              <div className="onStep css-keef6k">
                <h6 className="">
                  <span className="text-uppercase color">Brutal Market</span>
                </h6>
              </div>
              <div className="spacer-10"></div>
              <div className="onStep css-142k476">
                <h1 className="">Create, sell or collect different NFT.</h1>
              </div>
              <div className="onStep css-11qk5q4">
                <p className=" lead">
                  Unit of data stored on a digital ledger, called a blockchain,
                  that certifies a digital asset to be unique and therefore not
                  interchangeable
                </p>
              </div>
              <div className="spacer-10"></div>
              <div className="onStep css-133dzi1">
                <span className="btn-main lead">Explore</span>
              </div>
              <div className="onStep css-133dzi1">
                <div className="mb-sm-30"></div>
              </div>
              <div className="spacer-double"></div>
            </div>
            
          </div>
        </div>
      </section>
    );
  }
}

export default HomeSlider;
