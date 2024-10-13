# Metacrafters - Assessment DApp

This project is a decentralized file management application built on Ethereum using Hardhat. The DApp allows users to manage files (adding, removing, and viewing), while the contract owner can deposit, withdraw funds, and transfer ownership.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [File Management](#file-management)
  - [Balance Management](#balance-management)
  - [Ownership Transfer](#ownership-transfer)
- [Technologies Used](#technologies-used)
- [Smart Contract](#smart-contract)
  - [Functions](#functions)
- [Frontend](#frontend)
  - [Setup](#setup)
  - [Available Scripts](#available-scripts)
  - [Deployment](#deployment)

## Overview

The **Assessment DApp** is built on top of Ethereum smart contracts using Hardhat and provides a decentralized way to manage files. The contract also includes functionality for managing balance and transferring ownership, all controlled via a React frontend connected to MetaMask.

## Features

### File Management
Users can:
- **Add files**: Include file name, size, author, and total downloads.
- **Remove files**: Delete previously added files.
- **View files**: See a list of files they have uploaded.

### Balance Management
Contract owners can:
- **Deposit**: Add Ether to the smart contract.
- **Withdraw**: Remove Ether from the contract, but only if the contract has sufficient funds.

### Ownership Transfer
- The current contract owner can **transfer ownership** to a new Ethereum address.

## Technologies Used

- **Solidity**: For writing the smart contract.
- **Hardhat**: For compiling, deploying, and testing smart contracts.
- **React**: For building the frontend interface.
- **Ethers.js**: For interacting with the Ethereum blockchain.
- **MetaMask**: For wallet connection and account management.
- **Ethereum**: For deploying and running the contract.

## Smart Contract

The smart contract is written in Solidity and deployed on Ethereum. It has several core features, including file management, Ether balance handling, and ownership transfer.

### Functions

- **getBalance()**: Returns the current Ether balance of the contract.
- **deposit()**: Allows the owner to deposit Ether into the contract.
- **withdraw(uint256 _amount)**: Allows the owner to withdraw Ether from the contract, provided there are enough funds.
- **transferOwnership(address payable _newOwner)**: Transfers the ownership of the contract to a new address.
- **addFile(string memory _name, uint256 _size, string memory _author, uint256 _downloads)**: Adds a file to the user's file collection.
- **removeFile(uint256 index)**: Removes a file at a given index from the user's file collection.
- **getFiles()**: Returns a list of files the user has uploaded.

## Frontend

The frontend is a React-based web interface that interacts with the smart contract via MetaMask. It provides a simple interface for connecting a wallet, adding/removing files, and handling Ether transactions.

### Setup

To set up the project locally:

1. Clone the repository:
   ```bash
   git clone [repo_link]
   cd Assessment-DApp
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Runs the app in development mode.

## Deployment

### Hardhat Deployment

This project uses Hardhat for compiling, deploying, and testing the smart contracts. The deployment script is located in the `scripts` directory.

### Steps to Deploy

1. Compile the contracts:
   ```bash
   npx hardhat compile
   ```

2. Deploy the contract to the desired network (e.g., a local Hardhat network or a testnet like Rinkeby or Goerli):
   ```bash
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

3. The deployment script will log the deployed contract address, which you can use in the frontend.

### Running Local Network for Testing

To run a local Hardhat Ethereum node for testing:

```bash
npx hardhat node
```

Then deploy the contract to the local Hardhat network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```
