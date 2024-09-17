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
