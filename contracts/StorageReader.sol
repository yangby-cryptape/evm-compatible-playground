// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

interface StorageInterface {
    function loadUint256() external view returns (uint256);
}

contract StorageReader {

    function loadUint256(address addr) public view returns (uint256) {
        return StorageInterface(addr).loadUint256();
    }
}
