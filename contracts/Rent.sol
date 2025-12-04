pragma solidity ^0.8.0;

contract RentalAgreement{
   address public landlord;
   address public tenant;
   address public propertyManager;

   bool public landlordAgreed;
   bool public tenantAgreed;
   bool public propertyManagerAgreed;
   bool public depositPaid;

   uint public rentCost;
   uint public securityDeposit;
   uint public managementFeePercent;
   
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

   event RentPaid(address tenant, uint amount, uint timestamp);
   event ContractSigned(uint timestamp);

   constructor (
      address _landlord,
      address _tenant,
      address _propertyManager,
      uint _rentCost,
      uint _securityDeposit,
      uint _managementFeePercent, 
      uint _start, 
      uint _end
   ) {
      landlord = _landlord;
      tenant = _tenant;
      propertyManager = _propertyManager;
      rentCost = _rentCost;
      securityDeposit = _securityDeposit;
      managementFeePercent = _managementFeePercent;
      start = _start;
      end = _end;
      active = false;
   }

   function agreeToTerms() external {
      if(msg.sender == landlord) landlordAgreed = true;
      else if (msg.sender == tenant) tenantAgreed = true;
      else if(msg.sender == propertyManager) propertyManagerAgreed = true;
      else revert("Not a party in this contract");

      signContract();
   }

   function payDeposit() external payable{
      require(msg.sender == tenant, "Only tenant is allowed.");
      require(!depositPaid, "Deposit already paid");
      require(msg.value == securityDeposit);

      depositHeld = msg.value;
      depositPaid = true;

      signContract();
   }

   function signContract() internal {
      require(tenantAgreed, "Tenant hasn't agreed to terms");
      require(landlordAgreed, "Landlord hasn't agreed to terms");
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

      emit RentPaid(msg.sender, msg.value, block.timestamp);
   }
}