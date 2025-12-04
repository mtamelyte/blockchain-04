pragma solidity ^0.8.0;

contract RentalAgreement{
   address public landlord;
   address public tenant;
   address public propertyManager;

   uint public rentCost;
   uint public securityDeposit;
   uint public managementFeePercent;
   
   uint public lastPayment;
   uint public depositHeld;
   bool public isActive;

   uint public start;
   uint public end;

   struct Payment{
      uint id;
      uint value;
      uint timestamp;
   }

   Payment[] public paidRent;

   mapping(address => uint) public balance; 

   event RentPaid(address tenant, uint amount, uint timestamp);

   constructor (address _tenant,
   address _propertyManager,
   uint _rentCost,
   uint _securityDeposit,
   uint _managementFeePercent, 
   uint _start, 
   uint _end
   ) payable {
      landlord = msg.sender;
      tenant = _tenant;
      propertyManager = _propertyManager;
      rentCost = _rentCost;
      securityDeposit = _securityDeposit;
      managementFeePercent = _managementFeePercent;
      start = _start;
      end = _end;
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

      emit RentPaid(msg.sender, msg.value, block.timestamp);
   }
}