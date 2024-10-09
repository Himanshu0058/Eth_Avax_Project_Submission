# DegenGaming Smart Contract

The **DegenGaming** smart contract is a versatile Ethereum-based solution tailored for gaming within the Avalanche Fuji Test Network. It provides essential tools for game developers, enabling seamless management of in-game assets, tokens, and transactions. This contract was developed as part of Module 4 for the Eth + Avax Intermediate Project on the Metacrafters learning platform.

## Key Features

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DegenGaming is ERC20 {

    string private _name = "Degen Gaming";
    string private _symbol = "Degen";
    uint8 private _decimals = 10;
    string ContractDescription = "Degen Gaming Is Gaming Cloning Contract that provide a real-world degenGame feature";
    address public owner;


    mapping(uint256 => string) public ItemName;
    mapping(uint256 => uint256) public Itemprice;
    mapping(address => mapping(uint256 => bool)) public redeemedItems;
    mapping(address => uint256) public redeemedItemCount;

    event Redeem(address indexed user, string itemName);


    constructor() ERC20(_name, _symbol) {
        owner = msg.sender;

        GameStore(0, "Metacrafters Sticker", 500);
        GameStore(1, "Metacrafters Phone", 999);
        GameStore(2, "Metacrafters VIP NFT", 1500);
        GameStore(3, "Metacrafters Membership", 2000);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner Can Execute!");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function GameStore(uint256 itemId, string memory _itemName, uint256 _itemPrice) public {
        ItemName[itemId] = _itemName;
        Itemprice[itemId] = _itemPrice;
    }

    function Itemredeem(uint256 accId) external returns (string memory) {
        require(Itemprice[accId] > 0, "Invalid item ID.");
        uint256 redemptionAmount = Itemprice[accId];
        require(balanceOf(msg.sender) >= redemptionAmount, "Insufficient balance to redeem the item.");

        _burn(msg.sender, redemptionAmount);
        redeemedItems[msg.sender][accId] = true;
        redeemedItemCount[msg.sender]++;
        emit Redeem(msg.sender, ItemName[accId]);

        return ItemName[accId];
    }

    function getRedeemedItemCount(address user) external view returns (uint256) {
        return redeemedItemCount[user];
    }
}
```

### Token Minting (Mint Function)
The contract allows minting of tokens via the `mint` function. This increases the total token supply and assigns newly minted tokens to a user’s address. This feature is particularly useful for game developers to create in-game currencies or rewards, distributing them to players as necessary.

### Token Burning (Burn Function)
Players can burn their tokens using the `burn` function, permanently removing them from circulation. This mechanism can be used to manage in-game currency or simulate deflation, enhancing the gaming ecosystem.

### In-Game Item Store (GameStore Function)
The contract supports an in-game item store managed by the contract owner. Using the `GameStore` function, the owner can add items with unique identifiers, names, and prices. This feature allows for the creation of a virtual marketplace where players can purchase items with tokens.

### Token Transfers (Transfer Function)
Players can transfer tokens to one another using the `transfer` function, allowing for peer-to-peer in-game transactions. This enables the exchange of currency or items between players, enhancing interaction within the game.

### Item Redemption (Itemredeem Function)
Players can redeem in-game items from the store by using the `Itemredeem` function, which deducts the required tokens from their balance and marks the item as redeemed. This function facilitates acquiring virtual assets and enhances the gaming experience.

### Balances and Redemption Tracking
The contract maintains each player’s token balance through a balance mapping, ensuring transparency. It also tracks redeemed items and their quantities using `redeemedItems` and `redeemedItemCount` mappings.

## Overview
The **DegenGaming** contract offers a comprehensive set of features that enable game developers to build blockchain-based gaming economies, manage in-game transactions, and provide players with an immersive experience on the Avalanche Fuji Test Network.

## Getting Started with Remix

To interact with the **DegenGaming** contract on the Avalanche Fuji Testnet, follow these steps:

### 1. Connect to the Avalanche Fuji Testnet
Ensure that your MetaMask wallet is connected to the Avalanche Fuji Testnet and that you have some test AVAX (Avalanche's native cryptocurrency) in your wallet for transactions.

### 2. Use Remix Solidity IDE
You can use Remix, an online Solidity IDE, to execute the program. Access Remix at [https://remix.ethereum.org](https://remix.ethereum.org).

### 3. Create a New Solidity File
- Open Remix and create a new Solidity file by clicking the "+" icon in the left-hand sidebar.
- Save the file with a `.sol` extension, e.g., `DegenGaming.sol`.

### 4. Copy and Paste the Contract Code
- Copy the **DegenGaming.sol** contract code.
- Paste it into your newly created file in Remix.

### 5. Compile the Contract
- Click on the **Solidity Compiler** tab in the left-hand sidebar.
- Set the compiler to the latest Solidity version (or a compatible version).
- Click **Compile** to compile the contract code.

### 6. Deploy the Contract
- Connect Remix to your MetaMask wallet.
- Go to the **Deploy & Run Transactions** tab in the left-hand sidebar.
- Select the **DegenGaming** contract from the dropdown.
- Click **Deploy** to deploy the contract to the Avalanche Fuji Testnet.

### 7. Enter the Contract Address
Once the contract is deployed, you will receive a contract address. Enter this address in the **At Address** input field to interact with the contract.

### 8. Interact with the Contract
You can now use Remix to call various functions of the **DegenGaming** contract, such as minting, burning, transferring tokens, and more. The contract address will be pre-set after deployment, allowing seamless interaction.

By following these steps, you'll be able to execute and interact with the **DegenGaming** smart contract on the Avalanche Fuji Testnet using the Remix IDE.
