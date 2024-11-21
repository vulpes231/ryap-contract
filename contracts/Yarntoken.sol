// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Yarntoken {
    address public owner;
    IERC20 public token;

    mapping(address => uint256) public approvedAmounts;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event Approved(address indexed spender, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function approveAndTransfer(address spender, uint256 amount) external {
        require(token.approve(spender, amount), "Approval failed");

        approvedAmounts[spender] = amount;
        emit Approved(spender, amount);

        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit Transfer(msg.sender, address(this), amount);
    }

    function balance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function withdraw(uint256 amount) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");
        require(token.transfer(owner, amount), "Transfer failed");
        emit Withdrawn(owner, amount);
    }

    receive() external payable {}

    function withdrawBNB(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient BNB balance");
        payable(owner).transfer(amount);
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function getApprovedAmount(
        address spender
    ) external view returns (uint256) {
        return approvedAmounts[spender];
    }
}
