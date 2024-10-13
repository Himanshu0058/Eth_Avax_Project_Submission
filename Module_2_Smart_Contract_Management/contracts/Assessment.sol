// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Assessment {

    address payable public owner;
    uint256 public balance;

    struct File {
        string name;
        uint256 size;
        string author;
        uint256 totalDownloads;
    }
    
    mapping(address => File[]) public files;
     
    constructor(uint256 initBalance) {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "Not the owner of this contract");
        balance += _amount;
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "Not the owner of this contract");
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({balance: balance, withdrawAmount: _withdrawAmount});
        }
        balance -= _withdrawAmount;
    }

    function transferOwnership(address payable _newOwner) public {
        require(msg.sender == owner, "Not the owner of this contract");
        require(_newOwner != address(0), "Invalid new owner address");
        owner = _newOwner;
    }

    function addFile(string memory _name, uint256 _size, string memory _author, uint256 _downloads) public {
        File memory newFile = File({
            name: _name,
            size: _size,
            author: _author,
            totalDownloads: _downloads
        });
        files[msg.sender].push(newFile);
    }

    function removeFile(uint256 index) public {
        require(index < files[msg.sender].length, "Invalid file index");
        for (uint256 i = index; i < files[msg.sender].length - 1; i++) {
            files[msg.sender][i] = files[msg.sender][i + 1];
        }
        files[msg.sender].pop();
    }

    function getFiles() public view returns (File[] memory) {
        return files[msg.sender];
    }
}
