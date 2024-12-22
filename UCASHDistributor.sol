// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract UCASHDistributor {

    address public UCASH = 0x92e52a1A235d9A103D970901066CE910AAceFD37;
   
    function distributeUCASH(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(recipients.length == amounts.length, "Length mismatch");
        
        IERC20 ucashContract = IERC20(token);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            ucashContract.transfer(recipients[i], amounts[i]);
        }
    }
}