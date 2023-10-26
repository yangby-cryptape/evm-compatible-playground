// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

contract CurrencySender {
    function sendViaTransfer(address payable to) public payable {
        to.transfer(msg.value);
    }

    function sendViaSend(address payable to) public payable {
        bool result = to.send(msg.value);
        require(result, "Failed to send via send(..)");
    }

    function sendViaCall(address payable to) public payable {
        (bool result, ) = to.call{ value: msg.value }("");
        require(result, "Failed to send via call(..)");
    }
}
