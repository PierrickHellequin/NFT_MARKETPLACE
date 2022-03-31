const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", function () {
  let deployer, addr1, addr2, nft, marketplace, NFT;
  let feePercent = 1;
  let URI = "";
  beforeEach(async function () {
    //Get contract factories
    NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    [deployer, addr1, addr2, addr3] = await ethers.getSigners();

    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe("Deployment", function () {
    it("Sould track name and symbol of the nft collection", async function () {
      expect(await nft.name()).to.equal("Brutal NFT");
      expect(await nft.symbol()).to.equal("Brutal");
    });
    it("Sould track feePercent and feeAccount of the marketplace", async function () {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe("Mintings NFTs", function () {
    it("Should track each minted NFT", async function () {
      // addr1 mints an nft
      await nft.connect(addr1).mint(URI, 0);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // addr2 mints an nft
      await nft.connect(addr2).mint(URI, 0);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
    });
  });

  describe("Making marketplace items", function () {
    beforeEach(async function () {
      // addr1 mint an NFT
      await nft.connect(addr1).mint(URI, 0);
      // addr1 approve marketplace to spend nft
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
    });
    it("Should track new NFt, transfer nft of seller to nft marketplace and emit offered event", async function () {
      //addr1 offers their nft at a price of 1 ether
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1), 0)
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.address, 1, toWei(1), 0, addr1.address);
      //Expect owner of nft is now the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // ItemCount of markeplace is 1
      expect(await marketplace.itemCount()).to.equal(1);
      //Fetch item from items mapping and check data
      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenID).to.equal(1);
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
    });

    it("Fail if price is set to zero", async function () {
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, 0, 0)
      ).to.be.revertedWith("Price must be greater thran zero");
    });
  });

  describe("Purchasing marketplace items", function () {
    let price = 2;
    beforeEach(async function () {
      // addr1 mint an NFT
      await nft.connect(addr1).mint(URI, 0);
      // addr1 approve marketplace to spend nft
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
      //addr1 transfer nft to marketplace
      await marketplace
        .connect(addr1)
        .makeItem(nft.address, 1, toWei(price), 0);
    });

    it("Should update item as sold, transfer nft to buyer, charge fees and emit as bought event", async function () {
      const sellerEth = await addr1.getBalance();
      const feeAccountEth = await deployer.getBalance();

      let totalPriceInWei = await marketplace.getTotalPrice(1);
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      )
        .to.emit(marketplace, "Bought")
        .withArgs(
          1,
          1,
          toWei(price),
          0,
          nft.address,
          addr1.address,
          addr2.address
        );
      const sellerFinalETH = await addr1.getBalance();
      const feeAccountFinalETH = await deployer.getBalance();

      //Calculate balance of seller after the sell
      expect(+fromWei(sellerFinalETH)).to.equal(+price + +fromWei(sellerEth));

      const fee = (feePercent / 100) * price;
      //Calculate balance of feeAccount after the sell
      expect(+fromWei(feeAccountFinalETH)).to.equal(
        +fee + +fromWei(feeAccountEth)
      );
      //owner of nft
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      //sold equal to true
      expect((await marketplace.items(1)).sold).to.equal(true);
    });

    it("Should fail for invalid item id, sold item, and not enough ether", async function () {
      await expect(
        marketplace.connect(addr2).purchaseItem(2, { value: 2 })
      ).to.be.revertedWith("item doesn't exist");

      let totalPriceInWei = await marketplace.getTotalPrice(1);
      await marketplace
        .connect(addr2)
        .purchaseItem(1, { value: totalPriceInWei });
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      ).to.be.revertedWith("Item already sold");

      await expect(
        marketplace.connect(addr2).purchaseItem(1)
      ).to.be.revertedWith("Not enough ether to cover price");
    });
  });

  describe("Test royalties on NFT marketplace", function () {
    let price = 2;
    beforeEach(async function () {
      // addr1 mint an NFT
      await nft.connect(addr1).mint(URI, 10);
      // addr1 approve marketplace to spend nft
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
      //addr1 transfer nft to marketplace
      await marketplace
        .connect(addr1)
        .makeItem(nft.address, 1, toWei(price), 10);
    });

    it("check info on NFT", async function () {
      let infos = await nft.getRoyaltiesInfos(1);
      // Check than the royalty are equal at 10
      expect(infos.royaltiyFee).to.equal(10);
      // Check creator
      expect(infos.creator).to.equal(addr1.address);
    });

    it("Check balance of the creator after two sell", async function () {
      let creatorBalance = await addr1.getBalance();
      let totalPriceInWei = await marketplace.getTotalPrice(1);
      await marketplace
        .connect(addr2)
        .purchaseItem(1, { value: totalPriceInWei });

      let item = await marketplace.items(1);
      let creatorBalanceAfter = await addr1.getBalance();
      let royaltyFee = (fromWei(item.price) * 10) / 100;

      let priceWithoutRoyalty = fromWei(item.price) - royaltyFee;

      expect(+fromWei(creatorBalanceAfter)).to.equal(
        +priceWithoutRoyalty + +fromWei(creatorBalance) + +royaltyFee
      );

      // Approve the marketplace to sell the nft
      await nft.connect(addr2).setApprovalForAll(marketplace.address, true);
      //Put the nft to sell by addr2
      let newPrice = 30;
      await marketplace
        .connect(addr2)
        .sellItem(nft.address, 1, toWei(newPrice));

      item = await marketplace.items(1);
      let newTotalPrice = await marketplace.getTotalPrice(1);
      let newcreatorBalance = await addr1.getBalance();
      royaltyFee = (item.price * item.royalties) / 100;

      marketplace.connect(addr3).purchaseItem(1, { value: newTotalPrice });

      let newcreatorBalanceAfter = await addr1.getBalance();
      royaltyFee = ethers.BigNumber.from(royaltyFee.toString());

      // check if the creator receive royalty after the sell
      expect(newcreatorBalanceAfter).to.equal(
        newcreatorBalance.add(royaltyFee)
      );
    });
  });
});
