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
   
<img width="1511" height="523" alt="Screenshot 2025-12-17 155302" src="https://github.com/user-attachments/assets/a25bed54-cd42-4842-acd0-2b8f6d75654b" />

<img width="1704" height="1402" alt="Screenshot 2025-12-17 155319" src="https://github.com/user-attachments/assets/51f47bc3-f159-480f-a6f3-e3d7d516edad" />

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
   
<img width="1646" height="1412" alt="Screenshot 2025-12-17 135137" src="https://github.com/user-attachments/assets/b66cc9d3-d7a6-4e0d-9cef-69d26754a9df" />

## Frontend application

### Start

Upon logging in, you have to input your smart contract address in settings, and connect with your MetaMask wallet.
If you are the landlord who deployed the contract, you will be allowed to manage the contract, update the terms such as rent or security deposit cost, or sign as property manager if there isn't one signed already.
If you are not the landlord and the contract is not active, you will be allowed to sign as the tenant and pay the security deposit, or sign as the property manager.
<img width="2559" height="1473" alt="Screenshot 2025-12-17 153422" src="https://github.com/user-attachments/assets/b2bb289c-c310-4e07-9f65-ea2efa0af5e0" />
<img width="2559" height="1467" alt="Screenshot 2025-12-17 153430" src="https://github.com/user-attachments/assets/37dfb9c2-697e-47b8-b3f2-f7a98a921423" />
<img width="2559" height="1364" alt="Screenshot 2025-12-17 153730" src="https://github.com/user-attachments/assets/013cd954-7806-4123-9a38-ab0485043289" />
<img width="1848" height="481" alt="Screenshot 2025-12-17 153743" src="https://github.com/user-attachments/assets/805ffb74-c28e-4418-93f4-6bf5404c65f5" />
<img width="1857" height="404" alt="Screenshot 2025-12-17 153751" src="https://github.com/user-attachments/assets/14d25f0e-a724-4028-b7de-1d4a6f6ebffa" />
<img width="2559" height="1437" alt="Screenshot 2025-12-17 153831" src="https://github.com/user-attachments/assets/17fc22e1-e539-46e3-bfad-a5bcd43f1a51" />

### Functionality

Once everyone has signed the contract and the deposit has been paid, the contract will become active and all the participants will be able to interact with it.

#### Tenant

The tenant can pay rent via the contract, which will get added to the payment history that is also visible in the contract.
<img width="1866" height="439" alt="Screenshot 2025-12-17 154739" src="https://github.com/user-attachments/assets/32c370df-4c3e-427d-ab46-a9f6c05691a1" />
<img width="1880" height="466" alt="Screenshot 2025-12-17 154758" src="https://github.com/user-attachments/assets/0f9b1ec1-97dc-41f5-a7ff-028793573f47" />

#### Landlord

The landlord can withdraw the rent funds that are held within the contract, claim damages or terminate the contract.
<img width="1878" height="1078" alt="Screenshot 2025-12-17 154841" src="https://github.com/user-attachments/assets/508914ba-f569-4274-bbac-e63469844a23" />
<img width="674" height="318" alt="Screenshot 2025-12-17 154859" src="https://github.com/user-attachments/assets/7deb4b40-8dae-446b-ae45-9ba912caa365" />
<img width="1875" height="1387" alt="Screenshot 2025-12-17 154914" src="https://github.com/user-attachments/assets/875d839d-6fa9-464d-a894-6a8229cfe767" />

#### Property manager

As a property manager, you can withdraw the part of the rent that you get as per the agreement. If the property manager is also the landlord, this section doesn't exist and all the funds go directly to the landlord.
<img width="1871" height="759" alt="Screenshot 2025-12-17 154816" src="https://github.com/user-attachments/assets/9a775a63-3f65-4054-8b26-de81f233285a" />

