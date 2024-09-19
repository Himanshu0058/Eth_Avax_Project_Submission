# Eth_Avax Module 3 - ERC20 Contract Submission

## Overview

This project is a smart contract written in Solidity, implementing an ERC20 token named **MetaHim** (MHM). It leverages the OpenZeppelin ERC20 implementation, allowing for token minting, burning, and transferring of tokens. The contract includes additional customizations while maintaining compatibility with the ERC20 standard.

## Features

- **Minting**: Ability to mint new tokens to any account.
- **Burning**: Token holders can burn tokens, reducing the total supply.
- **Transfer Override**: The default `transfer` function of the ERC20 standard is overridden but maintains the same functionality.

## Contract Explanation

```solidity
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
```

- **Token Name**: MetaHim
- **Token Symbol**: MHM
- **Initial Supply**: 100,000 MHM
- **Decimals**: Follows the standard ERC20 decimals, typically 18.

## Functions

### Constructor
The constructor initializes the token contract with:
- Token name: `MetaHim`
- Token symbol: `MHM`
- Initial supply of `100,000 MHM` (adjusted for decimals), which is minted to the deployer’s address.

### Minting
```solidity
function mint(address account, uint256 amount) public
```
This function allows the contract owner to mint new tokens to the specified account. The amount minted is added to the total supply.

### Burning
```solidity
function burn(uint256 amount) public
```
This function allows token holders to burn a specified amount of their tokens, reducing the total supply.

### Transfer (Overridden)
```solidity
function transfer(address recipient, uint256 amount) public override returns (bool)
```
The `transfer` function is overridden, but it retains the standard ERC20 transfer logic, allowing token holders to send tokens to other accounts.

## How to Deploy

1. Install dependencies and tools:
   - Install the OpenZeppelin contracts library.
     ```bash
     npm install @openzeppelin/contracts
     ```

2. Compile the contract:
   Make sure to use the Solidity compiler version `0.8.26` or compatible versions.
   ```bash
   solc --version
   ```

3. Deploy the contract on your preferred network (e.g., Ethereum, BSC, Polygon) using tools like **Remix**, **Truffle**, **Hardhat**, or **any other deployment script**.

## License

This contract is licensed under the **MIT License** as indicated by the SPDX identifier at the top of the contract.

