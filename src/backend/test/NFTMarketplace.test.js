const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num); 

describe("NFTMarketplace", function(){
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "";
    beforeEach(async function(){
        //Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
        
        [deployer, addr1, addr2] = await ethers.getSigners();

        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function(){
        it("Sould track name and symbol of the nft collection", async function(){
            expect(await nft.name()).to.equal("Dapp NFT");
            expect(await nft.symbol()).to.equal("DAPP");
        })
        it("Sould track feePercent and feeAccount of the marketplace", async function(){
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        })
    })

    describe("Mintings NFTs", function(){
        it("Should track each minted NFT", async function(){
            // addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            // addr2 mints an nft
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
        })
    })

    describe("Making marketplace items", function(){
        beforeEach(async function(){
            // addr1 mint an NFT
            await nft.connect(addr1).mint(URI);
            // addr1 approve marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        })
        it("Should track new NFt, transfer nft of seller to nft marketplace and emit offered event", async function(){
            //addr1 offers their nft at a price of 1 ether
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1)))
                .to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(1),
                    addr1.address
                )
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

        it("Fail if price is set to zero", async function(){
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, 0)).to.be.revertedWith("Price must be greater thran zero");
        })
    })

    describe("Purchasing marketplace items", function(){
        let price = 2;
        beforeEach(async function(){
            // addr1 mint an NFT
            await nft.connect(addr1).mint(URI);
            // addr1 approve marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            //addr1 transfer nft to marketplace
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
        })

        it("Should update item as sold, transfer nft to buyer, charge fees and emit as bought event", async function(){
            const sellerEth = await addr1.getBalance();
            const feeAccountEth = await deployer.getBalance();

            let totalPriceInWei = await marketplace.getTotalPrice(1);
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address
                )
            const sellerFinalETH = await addr1.getBalance();
            const feeAccountFinalETH = await deployer.getBalance();
            //Calculate balance of seller after the sell
            expect(+fromWei(sellerFinalETH)).to.equal(+price + +fromWei(sellerEth));

            const fee = (feePercent / 100) * price;
            //Calculate balance of feeAccount after the sell
            expect(+fromWei(feeAccountFinalETH)).to.equal(+fee + +fromWei(feeAccountEth));
            //owner of nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            //sold equal to true
            expect((await marketplace.items(1)).sold).to.equal(true);

        })

        it("Should fail for invalid item id, sold item, and not enough ether", async function(){

            await expect(marketplace.connect(addr2).purchaseItem(2, {value: 2}))
                .to.be.revertedWith("item doesn't exist");

            let totalPriceInWei = await marketplace.getTotalPrice(1);
            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei});
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
                .to.be.revertedWith("Item already sold");     
            
            await expect(marketplace.connect(addr2).purchaseItem(1))
                .to.be.revertedWith("Not enough ether to cover price");     
                
        })
    })

})