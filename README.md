# Eth_Avax Module 01 - FreelancerBasic Smart Contract

## Overview
The `FreelancerBasic` contract is a simple decentralized agreement between a client and a freelancer for job completion and payment. This contract ensures that the freelancer gets paid only after the job is completed, while allowing the client to cancel the job before completion if needed.

## Key Features
1. **Client and Freelancer Roles**: 
   - The client is the party that creates the contract and deposits the funds.
   - The freelancer is assigned upon contract creation and is the only one who can mark the job as complete.

2. **Job Fee**:
   - The contract sets a fixed job fee of 100 units (assumed in wei).
   
3. **Job Completion**:
   - The freelancer can mark the job as complete. Once marked as complete, the client can release the payment to the freelancer.

4. **Payment Release**:
   - The client can release the payment to the freelancer once the job is completed. The contract ensures that the client has enough funds before releasing the payment.

5. **Job Cancellation**:
   - The client can cancel the job only if it hasn't been marked as completed by the freelancer. Once the job is canceled, the contract reverts.

## Contract Functions

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract FreelancerBasic {

    address public client;
    address public freelancer;
    uint public jobFee;
    bool public jobCompleted;

    mapping(address => uint256) public balances;

    constructor(address _freelancer) payable {

        client = msg.sender;
        freelancer = _freelancer;
        jobFee = 100;

    
        balances[client] = 1000;
    }


    function markJobAsComplete() public {

        if (msg.sender != freelancer) {
            revert("Only Freelancer can mark the job as complete.");
            
            }
            
            jobCompleted = true;
    }

    function releasePayment() public {
        require(jobCompleted, "Job must be completed before payment.");
        assert(msg.sender == client);
        require(balances[client] >= jobFee, "Insufficient balance in the contract.");

    
        balances[client] -= jobFee;
        balances[freelancer] += jobFee;
    }

    function cancelJob() view public {
        require(msg.sender == client, "Only the client can cancel the job.");
        require(!jobCompleted, "Job cannot be canceled after completion.");

        revert("Job has been canceled.");
    }
}
```

### Constructor: `constructor(address _freelancer) payable`
- Sets the client as the contract creator and assigns the freelancer.
- Initializes the job fee to 100 and sets the client's initial balance to 1000.

### `markJobAsComplete()`
- Can only be called by the freelancer.
- Marks the job as complete.

### `releasePayment()`
- Can only be called by the client.
- Releases the job fee to the freelancer if the job is marked as complete and the client has sufficient balance.

### `cancelJob()`
- Can only be called by the client.
- Cancels the job if it hasn't been completed yet. Reverts if the job is canceled.

## How to Use

1. **Deploy the Contract**: 
   - The client deploys the contract and specifies the freelancer's address. The contract automatically assigns the initial balance to the client.

2. **Freelancer Marks Job as Complete**:
   - Once the job is done, the freelancer calls `markJobAsComplete()`.

3. **Client Releases Payment**:
   - After confirming the job is complete, the client calls `releasePayment()` to pay the freelancer.

4. **Job Cancellation**:
   - If the job is no longer needed, the client can call `cancelJob()` before the freelancer marks it as complete.

## Requirements & Conditions
- Only the freelancer can mark the job as complete.
- Only the client can release payment and cancel the job.
- Payment can only be released if the job is completed.
- Job cancellation can only occur if the job is not completed yet.
