pragma solidity ^0.8.0;

contract RentalAgreement{
   address public landlord;
   address public tenant;
   address public propertyManager;

   uint public rentCost;
   uint public securityDeposit;
   uint public managementFee;
   
   uint public lastPayment;
   uint public depositHeld;
   bool public isActive;

   uint public start;
   uint public end;

   struct Payment{
      uint id;
      uint value;
   }

   Payment[] public paidRent;

   constructor (address _tenant,
   address _propertyManager,
   uint _rentCost,
   uint _securityDeposit,
   uint _managementFee, 
   uint _start, 
   uint _end
   ) payable {
      landlord = msg.sender;
      tenant = _tenant;
      propertyManager = _propertyManager;
      rentCost = _rentCost;
      securityDeposit = _securityDeposit;
      managementFee = _managementFee;
      start = _start;
      end = _end;
   }

}