// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is ERC721URIStorage {
    uint16 public maxSupply;
    string public baseUri;
    uint public tokenCount;


    constructor(
        string memory _name,
        string memory _symbol,
        uint16 _maxsupply,
        string memory _baseUri
    ) ERC721(_name, _symbol) {
        maxSupply = _maxsupply;
        baseUri = _baseUri;
    }

    function mint(string memory _tokenURI) external returns(uint){
        tokenCount ++;
        require(tokenCount <= maxSupply);
        _safeMint(msg.sender, tokenCount);
        //_setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }

}
