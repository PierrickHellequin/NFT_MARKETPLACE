// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{

    address payable public immutable feeAccount; // account receives fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenID;
        uint price;
        address payable seller;
        bool sold;
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenID,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenID,
        uint price,
        address indexed seller,
        address indexed buyer
    );
    
    //ItemId => Item
    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant{
        require(0 < _price, "Price must be greater thran zero");
        //increment 
        itemCount++;
        //transfer NFT
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "Not enough ether to cover price");
        require(!item.sold, "Item already sold");
        //Pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        //Update item
        item.sold = true;
        //transfer nft to buyer 
        item.nft.transferFrom(address(this), msg.sender, item.tokenID);

        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenID,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return (items[_itemId].price * (100 + feePercent)/100);
    }
}