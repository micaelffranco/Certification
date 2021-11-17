//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Certification {
    Certificate[] public certificates;
    struct Certificate {
        uint index;
        address owner;
        string title;
        string artist;
        uint year;
        string image;
    }

    function createCertificate(string memory title, string memory artist, uint year, string memory image) public {

      Certificate memory newCertificate = Certificate({
        index: certificates.length,
        owner: msg.sender,
        title: title,
        artist: artist,
        year: year,
        image: image
     });
     certificates.push(newCertificate);
    }

    function getCertificates() public view returns (Certificate[] memory) {
      return certificates;
    }

    function editCertificate(uint index, address owner, string memory title, string memory artist, uint year, string memory image) public {
      Certificate memory newCertificate = Certificate({
        index: index,
        owner: owner,
        title: title,
        artist: artist,
        year: year,
        image: image
     });
     certificates[index] = newCertificate;
    }
}
