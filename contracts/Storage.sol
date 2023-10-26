// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

contract Storage {

    uint256 number;

    constructor () {
        number = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    }

    function storeUint256(uint256 input) public {
        number = input;
    }

    function loadUint256() public view returns (uint256) {
        return number;
    }
}
