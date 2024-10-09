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