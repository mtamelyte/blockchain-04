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
      string memory _houseAddress,
      uint _rentCost,
      uint _securityDeposit,
      uint _managementFeePercent, 
      uint _start, 
      uint _end
   ) {
      landlord = msg.sender;
      houseAddress = _houseAddress;
      rentCost = _rentCost;
      securityDeposit = _securityDeposit;
      managementFeePercent = _managementFeePercent;
      start = _start;
      end = _end;
      active = false;
   }

   function signAsTenant() external {
      require(msg.sender!=landlord, "Landlord can't be his own tenant");
      require(msg.sender!=propertyManager, "Cannot be a tenant on a property that you manage");
      tenant = msg.sender;
      signContract();

      emit AgreedToTerms(tenant, block.timestamp);
   }

   function signAsPropertyManager() external {
      require(msg.sender!=tenant, "Tenant can't manage the property they are renting");
      propertyManager = msg.sender;
      signContract();

      emit AgreedToTerms(propertyManager, block.timestamp);
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
      require(active, "Lease has not been signed.");
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

   function getPayment(uint paymentIndex) public view returns(Payment memory) {
      return paidRent[paymentIndex];
   }
}