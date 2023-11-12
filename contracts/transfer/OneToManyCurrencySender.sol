// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.21 <0.9.0;

contract OneToManyCurrencySender {

    struct Bill {
        address payee;
        uint128 value;
    }

    function sendSameValue (address payable[] memory payees, uint128 value) public payable {
        uint256 balance = msg.value;
        uint256 total = payees.length * value;
        require(balance >= total, "Balance is not enough");
        for (uint32 i = 0; i < payees.length; i++){
            (bool result, ) = payees[i].call{ value: value }("");
            require(result, "Failed to send via call(..)");
            balance -= value;
        }
        if (balance > 0) {
          (bool result, ) = payable(msg.sender).call{ value: balance }("");
          require(result, "Failed to get change back");
        }
    }

    function sendValues (Bill[] memory bills) public payable {
        uint256 balance = msg.value;
        uint256 total = 0;
        for (uint32 i = 0; i < bills.length; i++){
            uint128 value = bills[i].value;
            total += value;
            require(total >= value, "Overflow when does sum");
        }
        require(balance >= total, "Balance is not enough");
        uint256 remained = balance - total;
        for (uint32 i = 0; i < bills.length; i++){
            uint128 value = bills[i].value;
            (bool result, ) = payable(bills[i].payee).call{ value: value }("");
            require(result, "Failed to send via call(..)");
            balance -= value;
        }
        require(balance == remained , "Remained is incorrect");
        if (balance > 0) {
          (bool result, ) = payable(msg.sender).call{ value: balance }("");
          require(result, "Failed to get change back");
        }
    }
}
