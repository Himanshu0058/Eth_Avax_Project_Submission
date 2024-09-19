// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    // Official Format
    
    constructor() ERC20("MetaHim", "MHM") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Override ERC20 'transfer Function' -> Our 'transfer' function

        return super.transfer(recipient, amount);
    }
}
