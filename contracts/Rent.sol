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


}