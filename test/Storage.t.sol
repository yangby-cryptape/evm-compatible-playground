// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

import {Test, console2} from "forge-std/Test.sol";

import {Storage, DEFAULT_UINT256_VALUE} from "../src/Storage.sol";

contract StorageTest is Test {
    Storage st;

    function setUp() public {
        st = new Storage();
    }

    function test_Uint256() public {
        assertEq(st.loadUint256(), DEFAULT_UINT256_VALUE);
        st.storeUint256(1);
        assertEq(st.loadUint256(), 0x1);
    }

    function testFuzz_Uint256(uint256 x) public {
        st.storeUint256(x);
        assertEq(st.loadUint256(), x);
    }
}
