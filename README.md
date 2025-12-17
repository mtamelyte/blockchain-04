# Creating smart contracts and decentralized applications

## Business model

### Description

The project is a smart contract for a rent agreement, coded using Solidity. The contract is between three entities - a landlord, a tenant, and a property manager (although there is the possibility to make it a two-party contract if the landlord is also the property manager).
The contract tracks the beginning and end of the lease, and allows these entities to sign a contract, for the tenant to pay rent, and for the landlord and property manager to withdraw these funds. It also has the tenant pay a deposit upon signing a contract and allows the landlord to give it back or claim some of it for property damages.

### Sequence diagram

## Testing

The contract was compiled and deployed using Truffle, and tested with Ganache and the Sepolia test network.

### Testing locally

1. Install Ganache CLI

   ```
   $ npm install ganache --global
   ```

2. Start Ganache in the command line
   ```
   $ ganache
   ```
3. Open the truffle console
   ```
   $ truffle console
   ```
4. Run various commands in the console to test the contract

### Testing with Sepolia

1. Create a [MetaMask developer account](https://developer.metamask.io/)
2. Get some Sepolia Eth in the wallet through a [faucet](https://sepolia-faucet.pk910.de/)
3. Create a .env file in the project folder
4. Get your own API key and the secret wallet mnemonic from the MetaMask developer website and put them in the .env file
5. Add a Sepolia network configuration in _truffle-config.js_
6. Deploy with Truffle

   ```
   $ truffle migrate --network sepolia
   ```

## Frontend application

### Start

Upon logging in, you have to input your smart contract address in settings, and connect with your MetaMask wallet.
If you are the landlord who deployed the contract, you will be allowed to manage the contract, update the terms such as rent or security deposit cost, or sign as property manager if there isn't one signed already.
If you are not the landlord and the contract is not active, you will be allowed to sign as the tenant and pay the security deposit, or sign as the property manager.

### Functionality

Once everyone has signed the contract and the deposit has been paid, the contract will become active and all the participants will be able to interact with it.

#### Tenant

The tenant can pay rent via the contract, which will get added to the payment history that is also visible in the contract.

#### Landlord

The landlord can withdraw the rent funds that are held within the contract, claim damages or terminate the contract.

#### Property manager

As a property manager, you can withdraw the part of the rent that you get as per the agreement. If the property manager is also the landlord, this section doesn't exist and all the funds go directly to the landlord.
