// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

uint256 constant DEFAULT_UINT256_VALUE = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

contract Storage {
    uint256 number;

    constructor() {
        number = DEFAULT_UINT256_VALUE;
    }

    function storeUint256(uint256 input) public {
        number = input;
    }

    function loadUint256() public view returns (uint256) {
        return number;
    }
}
