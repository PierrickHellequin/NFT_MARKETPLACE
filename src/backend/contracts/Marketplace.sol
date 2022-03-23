// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFT.sol";

contract Marketplace is ReentrancyGuard{

    address payable public immutable feeAccount; // account receives fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;

    struct Item{
        uint itemId;
        uint tokenID;
        uint price;
        uint256 royalties;
        IERC721 nft;
        address payable nftOwner;
        address payable creator;
        bool sold;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenID,
        uint price,
        uint256 _royalties,
        address indexed nftOwner
    );

    event Bought(
        uint itemId,
        uint tokenID,
        uint price,
        uint256 royalties,
        address indexed nft,
        address indexed nftOwner,
        address indexed buyer
    );

    event Deployed(address _contract, bytes32 salt);
    
    //ItemId => Item
    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price, uint256 _royalties) external nonReentrant{
        require(0 < _price, "Price must be greater thran zero");
        //increment 
        itemCount++;
        //transfer NFT
        _nft.transferFrom(msg.sender, address(this), _tokenId);
    
        items[itemCount] = Item (
            itemCount,
            _tokenId,
            _price,
            _royalties,
            _nft,
            payable(msg.sender),
            payable(msg.sender),
            false
        );

        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            _royalties,
            msg.sender
        );
    }

    // Test connexion à un contrat avec assembly
    function createNFTCollection(string memory _name, string memory _tokenURI) external  returns(address collectionAddress){
        bytes memory nftBytecode = type(NFT).creationCode;
				// Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_name));

        assembly {
            collectionAddress := create2(0, add(nftBytecode, 0x20), mload(nftBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        emit Deployed(collectionAddress, salt);
        NFT(collectionAddress).mintBis(_tokenURI, msg.sender);
        return collectionAddress;
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "Not enough ether to cover price");
        require(!item.sold, "Item already sold");
        
        //Pay seller and feeAccount
        uint256 royaltiesFee = (item.price * item.royalties)/100;
        item.nftOwner.transfer(item.price - royaltiesFee);
        feeAccount.transfer(_totalPrice - item.price);

        //Pay royalties if > 0 
        if(royaltiesFee > 0){
            item.creator.transfer(royaltiesFee);
        }
        //transfer nft to buyer 
        item.nft.transferFrom(address(this), msg.sender, item.tokenID);

        emit Bought(
            _itemId,
            item.tokenID,
            item.price,
            royaltiesFee,
            address(item.nft),
            item.nftOwner,
            msg.sender
        );

        //Update item
        item.sold = true;
        item.nftOwner = payable(msg.sender);
    }

    function sellItem(IERC721 _nft, uint _itemId, uint _price) external{
        require(_nft.ownerOf( _itemId) == msg.sender, "Caller must be the owner");
        require(_price > 0, "Free nft ?");
        Item storage item = items[_itemId];
        require(item.sold == true, "This nft is already on sale");
        //Update Item
        item.sold = false;
        item.price = _price;
        //Transfer nft to the marketplace
        _nft.transferFrom(msg.sender, address(this), _itemId);
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return (items[_itemId].price * (100 + feePercent)/100);
    }
}