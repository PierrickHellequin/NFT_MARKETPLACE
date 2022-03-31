// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    uint256 public tokenCount;
    address public artist;

    struct Item{
        uint256 itemID;
        uint256 royaltiyFee;
        address creator;
        string tokenUri;
    }
    //IDNFT = > item
    mapping(uint => Item) public items;

    event mintBisEvent(
        string _tokenURINFT,
        address indexed nft,
        uint256 tokenID,
        address indexed _ownerNFT
    );

    constructor() ERC721("Brutal NFT", "Brutal") {}

    function mint(string memory _tokenURI, uint _royaltyFee) external returns (uint256) {
        require(_royaltyFee <= 10, "The royalties is too high ! Greedy");
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        items[tokenCount] = Item (
            tokenCount,
            _royaltyFee,
            msg.sender,
            _tokenURI
        );
        return tokenCount;
    }


    function getRoyaltiesInfos(uint256 _itemId)  view public returns(Item memory){
        return items[_itemId];
    }
}
