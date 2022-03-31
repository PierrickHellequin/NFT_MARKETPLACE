import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import market from "../assets/img/market.png";

const Navigation = ({ web3Handler, account }) => {
  return (
    <header className="navbar white  sticky" id="myHeader">
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item">
              <a className="non-active" href="/">
                <img
                  src={market}
                  className="img-fluid d-block"
                  style={{ width: "50%" }}
                />
              </a>
            </div>
          </div>
          <div className="search">
            <input
              id="quick_search"
              className="xs-hide"
              name="quick_search"
              placeholder="search item here..."
              type="text"
            />
          </div>
          <div className="breakpoint__xl-only ">
            <div className="menu">
              <div className="navbar-item">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <span className="lines"></span>
              </div>
              <div className="navbar-item">
                <Nav.Link as={Link} to="/create">
                  Create
                </Nav.Link>
                <span className="lines"></span>
              </div>
              <div className="navbar-item">
                <Nav.Link as={Link} to="/my-listed-items">
                  My Listed Items
                </Nav.Link>
                <span className="lines"></span>
              </div>
              <div className="navbar-item">
                <Nav.Link as={Link} to="/my-purchases">
                  My Purchases
                </Nav.Link>
                <span className="lines"></span>
              </div>
            </div>
          </div>
          <div className="mainside">
            <div className="connect-wal">
              {account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4"
                >
                  {account.slice(0, 5) + "..." + account.slice(38, 42)}
                </Nav.Link>
              ) : (
                <a className="non-active" onClick={web3Handler}>
                  Connect Wallet
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
