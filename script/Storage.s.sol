// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

import {Script, console2} from "forge-std/Script.sol";

import {Storage, DEFAULT_UINT256_VALUE} from "../src/Storage.sol";

contract Deploy is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        Storage st = new Storage();
        assert(st.loadUint256() == DEFAULT_UINT256_VALUE);
        vm.stopBroadcast();
    }
}
