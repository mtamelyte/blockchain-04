// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalAgreement{
   address public landlord;
   address public tenant;
   address public propertyManager;

   bool public tenantAgreed;
   bool public propertyManagerAgreed;
   bool public depositPaid;

   uint public rentCost;
   uint public securityDeposit;
   uint public managementFeePercent;
   string public houseAddress;
   
   uint public lastPayment;
   uint public depositHeld;
   bool public active;

   uint public start;
   uint public end;

   struct Payment{
      uint id;
      uint value;
      uint timestamp;
   }

   Payment[] public paidRent;

   mapping(address => uint) public balance; 

   event RentPaid(uint timestamp);
   event ContractSigned(uint timestamp);
   event ContractTerminated(uint timestamp);
   event AgreedToTerms(address party, uint timestamp);
   event DepositPaid(uint timestamp);
   event DamagesClaimed(uint amount, uint timestamp);
   event DepositReturned(uint amount, uint timestamp);

   constructor (
      address _tenant,
      address _propertyManager,
      string memory _houseAddress,
      uint _rentCost,
      uint _securityDeposit,
      uint _managementFeePercent, 
      uint _start, 
      uint _end
   ) {
      landlord = msg.sender;
      tenant = _tenant;
      propertyManager = _propertyManager;
      houseAddress = _houseAddress;
      rentCost = _rentCost;
      securityDeposit = _securityDeposit;
      managementFeePercent = _managementFeePercent;
      start = _start;
      end = _end;
      active = false;
   }

   function agreeToTerms() external {
      if(msg.sender == tenant) tenantAgreed = true;
      else if(msg.sender == propertyManager) propertyManagerAgreed = true;
      else revert("Not a party in this contract");

      emit AgreedToTerms(msg.sender, block.timestamp);

      signContract();
   }

   function payDeposit() external payable{
      require(msg.sender == tenant, "Only tenant is allowed.");
      require(!depositPaid, "Deposit already paid");
      require(msg.value == securityDeposit);

      depositHeld = msg.value;
      depositPaid = true;

      emit DepositPaid(block.timestamp);

      signContract();
   }

   function signContract() internal {
      require(tenantAgreed, "Tenant hasn't agreed to terms");
      require(propertyManagerAgreed, "Property manager hasn't agreed to terms");
      require(depositPaid, "Security deposit hasn't been paid");

      active = true;
      emit ContractSigned(block.timestamp);
   }

   function payRent () external payable {
      require(msg.sender == tenant, "Only tenant is allowed.");
      require(msg.value == rentCost, "Wrong amount.");
      require(block.timestamp <= end, "Lease has ended.");

      uint managementFee = (msg.value * managementFeePercent) /100;
      uint landlordFee = msg.value - managementFee;

      balance[landlord] += landlordFee;
      balance[propertyManager] += managementFee;

      paidRent.push(Payment({
         id : paidRent.length + 1,
         value : msg.value,
         timestamp : block.timestamp
      }));

      lastPayment = block.timestamp;

      emit RentPaid(block.timestamp);
   }

   function terminateContract() external {
      require(msg.sender == landlord || 
      msg.sender == tenant || 
      msg.sender == propertyManager, 
      "Not a party in this contract");
      active = false;
      emit ContractTerminated(block.timestamp);
   }

   function claimDamages(uint amount) external {
      require(amount <= depositHeld, "Not enough money in deposit.");
      depositHeld -= amount;
      balance[landlord] += amount;

      emit DamagesClaimed(amount, block.timestamp);
   }

   function returnDeposit() external {
      require(msg.sender == landlord, "Only landlord allowed.");
      require(depositHeld > 0, "No deposit left");

      uint amountToReturn = depositHeld;
      depositHeld = 0;
      (bool returned, ) = payable(tenant).call{value: amountToReturn}("");
      require(returned, "Transfer failed");
      
      emit DepositReturned(amountToReturn, block.timestamp);
   }
}