let web3;
let contract;
let account;
let CONTRACT_ADDRESS;
let userRole = null; // 'landlord', 'tenant', 'manager', or null

// Hardcoded ABI - REPLACE WITH YOUR ACTUAL ABI
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_securityDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_managementFeePercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_end",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "party",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AgreedToTerms",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ContractSigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ContractTerminated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DamagesClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DepositPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DepositReturned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "party",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PropertyManagerLeft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RentPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "party",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TenantLeft",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TermsChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "active",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "depositHeld",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "depositPaid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "end",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "landlord",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "managementFeePercent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "paidRent",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "propertyManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "propertyManagerAgreed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "rentCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "securityDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "start",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "tenant",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "tenantAgreed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "signAsTenant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signAsPropertyManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "payDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "payRent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [],
    name: "terminateContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
    ],
    name: "changeRentCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
    ],
    name: "changeDepositValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "changeManagementFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
    ],
    name: "changeStartDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
    ],
    name: "changeEndDate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "claimDamages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "returnDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentIndex",
        type: "uint256",
      },
    ],
    name: "getPayment",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct RentalAgreement.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "leaveTenant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "leavePropertyManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Load saved configuration
window.onload = function () {
  const savedAddress = localStorage.getItem("contractAddress");

  if (savedAddress) {
    CONTRACT_ADDRESS = savedAddress;
    setTimeout(() => {
      const addressInput = document.getElementById("contractAddress");
      const configDisplay = document.getElementById("currentConfig");

      if (addressInput) {
        addressInput.value = savedAddress;
      }
      if (configDisplay) {
        configDisplay.textContent = savedAddress;
      }
    }, 100);
  }
};

function showPage(pageName) {
  const mainPage = document.getElementById("mainPage");
  const settingsPage = document.getElementById("settingsPage");

  if (!mainPage || !settingsPage) {
    console.error("Page elements not found");
    return;
  }

  mainPage.classList.remove("active");
  settingsPage.classList.remove("active");

  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  if (pageName === "main") {
    mainPage.classList.add("active");
    document.querySelectorAll(".nav-tab")[0].classList.add("active");
  } else if (pageName === "settings") {
    settingsPage.classList.add("active");
    document.querySelectorAll(".nav-tab")[1].classList.add("active");

    const savedAddress = localStorage.getItem("contractAddress");
    const configDisplay = document.getElementById("currentConfig");
    const addressInput = document.getElementById("contractAddress");

    if (savedAddress) {
      if (configDisplay) {
        configDisplay.textContent = savedAddress;
      }
      if (addressInput) {
        addressInput.value = savedAddress;
      }
    }
  }
}

function saveConfig() {
  const address = document.getElementById("contractAddress").value.trim();

  if (!address) {
    showMessage("Please provide a contract address", "error");
    return;
  }

  if (!address.startsWith("0x") || address.length !== 42) {
    showMessage("Invalid contract address format", "error");
    return;
  }

  localStorage.setItem("contractAddress", address);
  CONTRACT_ADDRESS = address;
  document.getElementById("currentConfig").textContent = address;
  showMessage(
    'Configuration saved! Go to Dashboard and click "Connect MetaMask".',
    "success"
  );
}

async function connectWallet() {
  if (!CONTRACT_ADDRESS) {
    showMessage("Please enter and save a contract address first!", "error");
    return;
  }

  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];

      web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      console.log("Connected to network:", networkId);

      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      document.getElementById("accountDisplay").style.display = "block";
      document.getElementById(
        "accountDisplay"
      ).innerHTML = `<strong>Connected:</strong> ${account}`;

      showMessage("Wallet connected successfully!", "success");

      await determineUserRole();
      await loadContractStatus();
      await loadBalance();
      await loadPaymentHistory();
      await showRelevantSections();

      ethereum.on("accountsChanged", async (accounts) => {
        account = accounts[0];
        await determineUserRole();
        await loadContractStatus();
        await loadBalance();
        await showRelevantSections();
      });
    } catch (error) {
      showMessage("Error connecting wallet: " + error.message, "error");
    }
  } else {
    showMessage("Please install MetaMask!", "error");
    window.open("https://metamask.io/download/", "_blank");
  }
}

async function determineUserRole() {
  try {
    const landlord = await contract.methods.landlord().call();
    const tenant = await contract.methods.tenant().call();
    const manager = await contract.methods.propertyManager().call();

    const landlordLower = landlord.toLowerCase();
    const tenantLower = tenant.toLowerCase();
    const managerLower = manager.toLowerCase();
    const accountLower = account.toLowerCase();

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    // Check roles based on addresses, not contract state
    if (accountLower === landlordLower) {
      userRole = "landlord";
    } else if (tenantLower !== zeroAddress && accountLower === tenantLower) {
      userRole = "tenant";
    } else if (managerLower !== zeroAddress && accountLower === managerLower) {
      userRole = "manager";
    } else {
      userRole = null;
    }

    console.log("User role:", userRole);
    console.log("Tenant address:", tenant);
    console.log("Manager address:", manager);
    console.log("Your address:", account);

    // Display role
    const roleDisplay = document.getElementById("userRole");
    if (userRole) {
      roleDisplay.style.display = "block";
      const roleEmoji =
        userRole === "landlord" ? "🏛️" : userRole === "tenant" ? "👤" : "👨‍💼";
      roleDisplay.innerHTML = `<span class="status-badge status-active">${roleEmoji} You are the ${
        userRole.charAt(0).toUpperCase() + userRole.slice(1)
      }</span>`;
    } else {
      roleDisplay.style.display = "none";
    }
  } catch (error) {
    console.error("Error determining user role:", error);
  }
}

async function showRelevantSections() {
  // Hide all action cards first
  document.getElementById("signCard").style.display = "none";
  document.getElementById("tenantCard").style.display = "none";
  document.getElementById("managerCard").style.display = "none";
  document.getElementById("landlordCard").style.display = "none";
  document.getElementById("termsCard").style.display = "none";
  document.getElementById("landlordSignSection").style.display = "none";
  document.getElementById("leaveTenantBtn").style.display = "none";
  document.getElementById("leaveManagerBtn").style.display = "none";

  // Always show these
  document.getElementById("statusCard").style.display = "block";
  document.getElementById("balanceCard").style.display = "block";
  document.getElementById("historyCard").style.display = "block";

  try {
    const tenantAgreed = await contract.methods.tenantAgreed().call();
    const managerAgreed = await contract.methods.propertyManagerAgreed().call();
    const depositPaid = await contract.methods.depositPaid().call();
    const active = await contract.methods.active().call();
    const manager = await contract.methods.propertyManager().call();
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    if (userRole === "landlord") {
      // Landlord sees everything
      document.getElementById("landlordCard").style.display = "block";

      // Show option to sign as manager if no manager exists or contract not active
      if (!active && (manager === zeroAddress || !managerAgreed)) {
        document.getElementById("landlordSignSection").style.display = "block";
      }

      if (!active) {
        document.getElementById("termsCard").style.display = "block";
      }
    } else if (userRole === "tenant") {
      // Tenant who has signed (address is set)
      document.getElementById("tenantCard").style.display = "block";

      // Show deposit section if not paid yet
      if (!depositPaid) {
        document.getElementById("depositSection").style.display = "block";
      } else {
        document.getElementById("depositSection").style.display = "none";
      }

      // Show leave button if contract is not active
      if (!active) {
        document.getElementById("leaveTenantBtn").style.display =
          "inline-block";
      }
    } else if (userRole === "manager") {
      // Manager who has active role
      document.getElementById("managerCard").style.display = "block";

      // Show leave button if contract is not active
      if (!active) {
        document.getElementById("leaveManagerBtn").style.display =
          "inline-block";
      }
    } else {
      // User hasn't signed or contract is terminated - show sign options
      const tenant = await contract.methods.tenant().call();
      const manager = await contract.methods.propertyManager().call();
      const zeroAddress = "0x0000000000000000000000000000000000000000";

      const tenantExists = tenant !== zeroAddress;
      const managerExists = manager !== zeroAddress;

      // Only show sign card if there's at least one available role
      if (!tenantExists || !managerExists) {
        document.getElementById("signCard").style.display = "block";

        if (!active && (tenantAgreed || managerAgreed)) {
          // Contract was terminated, show re-sign message
          document.getElementById("signMessage").innerHTML =
            "<strong>🔄 Contract has been terminated.</strong><br>" +
            "Sign up to participate in the new contract terms:";
        } else {
          // Fresh contract
          document.getElementById("signMessage").textContent =
            "You need to sign this rental agreement to proceed. Choose your role:";
        }

        // Show/hide buttons based on availability
        const signButtons = document.getElementById("signButtons");
        signButtons.style.display = "grid";
        signButtons.innerHTML = "";

        if (!tenantExists) {
          signButtons.innerHTML += `
                        <button class="btn btn-success" onclick="signAsTenant()">
                            Sign as Tenant
                        </button>
                    `;
        }

        if (!managerExists) {
          signButtons.innerHTML += `
                        <button class="btn btn-success" onclick="signAsManager()">
                            Sign as Property Manager
                        </button>
                    `;
        }

        document.getElementById("resignButtons").style.display = "none";
      } else {
        // Both roles are filled, show message
        document.getElementById("signCard").style.display = "block";
        document.getElementById("signMessage").innerHTML =
          "<strong>⚠️ All roles are filled.</strong><br>" +
          "Both tenant and property manager have signed this contract. Please wait for them to leave or for the contract to be terminated.";
        document.getElementById("signButtons").style.display = "none";
        document.getElementById("resignButtons").style.display = "none";
      }
    }

    // Update rent and deposit amounts
    const rentCost = await contract.methods.rentCost().call();
    const deposit = await contract.methods.securityDeposit().call();

    const rentAmountElements = document.querySelectorAll("#rentAmount");
    const depositAmountElements = document.querySelectorAll("#depositAmount");

    rentAmountElements.forEach((el) => {
      el.textContent = web3.utils.fromWei(rentCost.toString(), "ether");
    });

    depositAmountElements.forEach((el) => {
      el.textContent = web3.utils.fromWei(deposit.toString(), "ether");
    });
  } catch (error) {
    console.error("Error showing relevant sections:", error);
  }
}

async function loadContractStatus() {
  try {
    const landlord = await contract.methods.landlord().call();
    const tenant = await contract.methods.tenant().call();
    const manager = await contract.methods.propertyManager().call();
    const rentCost = await contract.methods.rentCost().call();
    const deposit = await contract.methods.securityDeposit().call();
    const managementFee = await contract.methods.managementFeePercent().call();
    const active = await contract.methods.active().call();
    const tenantAgreed = await contract.methods.tenantAgreed().call();
    const managerAgreed = await contract.methods.propertyManagerAgreed().call();
    const depositPaid = await contract.methods.depositPaid().call();
    const depositHeld = await contract.methods.depositHeld().call();
    const start = await contract.methods.start().call();
    const end = await contract.methods.end().call();

    const startDate = new Date(Number(start) * 1000).toLocaleDateString();
    const endDate = new Date(Number(end) * 1000).toLocaleDateString();

    let statusBadge = "";
    if (active) {
      statusBadge = '<span class="status-badge status-active">✅ Active</span>';
    } else if (tenantAgreed && managerAgreed && !depositPaid) {
      statusBadge =
        '<span class="status-badge status-pending">⏳ Awaiting Security Deposit</span>';
    } else if (tenantAgreed || managerAgreed || depositPaid) {
      statusBadge =
        '<span class="status-badge status-pending">⏳ Pending Signatures</span>';
    } else {
      statusBadge =
        '<span class="status-badge status-terminated">❌ Terminated / Not Started</span>';
    }

    document.getElementById("contractStatus").innerHTML = `
            <div class="status-item">
                <label>Contract Status</label>
                <div class="value">${statusBadge}</div>
            </div>
            <div class="status-item">
                <label>Monthly Rent</label>
                <div class="value">${web3.utils.fromWei(
                  rentCost.toString(),
                  "ether"
                )} ETH</div>
            </div>
            <div class="status-item">
                <label>Security Deposit</label>
                <div class="value">${web3.utils.fromWei(
                  deposit.toString(),
                  "ether"
                )} ETH</div>
            </div>
            <div class="status-item">
                <label>Management Fee</label>
                <div class="value">${managementFee}%</div>
            </div>
            <div class="status-item">
                <label>Deposit Held</label>
                <div class="value">${web3.utils.fromWei(
                  depositHeld.toString(),
                  "ether"
                )} ETH</div>
            </div>
            <div class="status-item">
                <label>Lease Period</label>
                <div class="value">${startDate} - ${endDate}</div>
            </div>
            <div class="status-item">
                <label>Landlord</label>
                <div class="value" style="font-size: 0.8em; word-break: break-all;">${landlord}</div>
            </div>
            <div class="status-item">
                <label>Tenant</label>
                <div class="value" style="font-size: 0.8em; word-break: break-all;">${tenant}</div>
            </div>
            <div class="status-item">
                <label>Property Manager</label>
                <div class="value" style="font-size: 0.8em; word-break: break-all;">${manager}</div>
            </div>
            <div class="status-item">
                <label>Tenant Agreed</label>
                <div class="value status-${tenantAgreed ? "yes" : "no"}">
                    ${tenantAgreed ? "✅ Yes" : "❌ No"}
                </div>
            </div>
            <div class="status-item">
                <label>Manager Agreed</label>
                <div class="value status-${managerAgreed ? "yes" : "no"}">
                    ${managerAgreed ? "✅ Yes" : "❌ No"}
                </div>
            </div>
            <div class="status-item">
                <label>Deposit Paid</label>
                <div class="value status-${depositPaid ? "yes" : "no"}">
                    ${depositPaid ? "✅ Yes" : "❌ No"}
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Error loading contract status:", error);
    showMessage("Error loading contract status: " + error.message, "error");
  }
}

async function loadBalance() {
  try {
    const balance = await contract.methods.balance(account).call();
    document.getElementById("balance").innerHTML = `${web3.utils.fromWei(
      balance.toString(),
      "ether"
    )} ETH`;
  } catch (error) {
    console.error("Error loading balance:", error);
  }
}

async function loadPaymentHistory() {
  try {
    let historyHtml = "";
    let index = 0;
    let foundPayments = false;

    while (index < 100) {
      try {
        const payment = await contract.methods.paidRent(index).call();

        if (payment.id && Number(payment.id) > 0) {
          foundPayments = true;
          const date = new Date(
            Number(payment.timestamp) * 1000
          ).toLocaleString();
          const amount = web3.utils.fromWei(payment.value.toString(), "ether");

          historyHtml += `
                        <div class="payment-item">
                            <div>
                                <strong>Payment #${payment.id}</strong><br>
                                <small>${date}</small>
                            </div>
                            <div style="text-align: right;">
                                <strong>${amount} ETH</strong>
                            </div>
                        </div>
                    `;
        }
        index++;
      } catch (e) {
        break;
      }
    }

    document.getElementById("paymentHistory").innerHTML = foundPayments
      ? historyHtml
      : '<p class="loading">No payments yet</p>';
  } catch (error) {
    console.error("Error loading payment history:", error);
    document.getElementById("paymentHistory").innerHTML =
      '<p class="loading">No payments yet</p>';
  }
}

async function signAsTenant() {
  try {
    // Check if tenant already exists
    const tenant = await contract.methods.tenant().call();
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    if (
      tenant !== zeroAddress &&
      tenant.toLowerCase() !== account.toLowerCase()
    ) {
      showMessage("A tenant has already signed this contract.", "error");
      return;
    }

    await contract.methods.signAsTenant().send({ from: account });
    showMessage("Successfully signed as tenant!", "success");
    await determineUserRole();
    await loadContractStatus();
    await showRelevantSections();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function signAsManager() {
  try {
    // Check if manager already exists
    const manager = await contract.methods.propertyManager().call();
    const zeroAddress = "0x0000000000000000000000000000000000000000";

    if (
      manager !== zeroAddress &&
      manager.toLowerCase() !== account.toLowerCase()
    ) {
      showMessage(
        "A property manager has already signed this contract.",
        "error"
      );
      return;
    }

    await contract.methods.signAsPropertyManager().send({ from: account });
    showMessage("Successfully signed as property manager!", "success");
    await determineUserRole();
    await loadContractStatus();
    await showRelevantSections();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function resignContract() {
  // Re-sign based on current role
  if (userRole === "tenant") {
    await signAsTenant();
  } else if (userRole === "manager") {
    await signAsManager();
  }
}

async function payDeposit() {
  try {
    const deposit = await contract.methods.securityDeposit().call();

    // Check deposit amount and show confirmation
    const depositEth = web3.utils.fromWei(deposit.toString(), "ether");
    if (
      !confirm(
        `Pay security deposit of ${depositEth} ETH? This will also sign you as tenant.`
      )
    ) {
      return;
    }

    await contract.methods.payDeposit().send({
      from: account,
      value: deposit,
    });
    showMessage(
      "Security deposit paid and contract signed successfully!",
      "success"
    );
    await determineUserRole();
    await loadContractStatus();
    await showRelevantSections();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function payRent() {
  try {
    const rent = await contract.methods.rentCost().call();
    await contract.methods.payRent().send({
      from: account,
      value: rent,
    });
    showMessage("Rent paid successfully!", "success");
    await loadContractStatus();
    await loadBalance();
    await loadPaymentHistory();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function withdraw() {
  try {
    const balance = await contract.methods.balance(account).call();

    if (Number(balance) === 0) {
      showMessage("No balance to withdraw", "error");
      return;
    }

    const balanceInEth = web3.utils.fromWei(balance.toString(), "ether");

    if (!confirm(`Withdraw ${balanceInEth} ETH to your wallet?`)) {
      return;
    }

    await contract.methods.withdraw().send({ from: account });

    showMessage(`Successfully withdrew ${balanceInEth} ETH!`, "success");
    await loadBalance();
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function claimDamages() {
  const amount = prompt("Enter damage amount in ETH:");
  if (!amount) return;

  try {
    const weiAmount = web3.utils.toWei(amount, "ether");
    await contract.methods.claimDamages(weiAmount).send({ from: account });
    showMessage(`Claimed ${amount} ETH for damages`, "success");
    await loadContractStatus();
    await loadBalance();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function returnDeposit() {
  try {
    await contract.methods.returnDeposit().send({ from: account });
    showMessage("Deposit returned to tenant!", "success");
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function terminateContract() {
  if (
    !confirm(
      "Are you sure you want to terminate the contract? This will reset the contract to its initial state."
    )
  )
    return;

  try {
    await contract.methods.terminateContract().send({ from: account });
    showMessage(
      "Contract terminated. All parties have been reset and can re-sign with new terms.",
      "success"
    );

    // Reset user role since contract is reset
    userRole = null;

    await determineUserRole();
    await loadContractStatus();
    await showRelevantSections();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Change Terms Functions
async function changeRentCost() {
  const newRent = document.getElementById("newRentCost").value;
  if (!newRent) {
    showMessage("Please enter a rent amount", "error");
    return;
  }

  try {
    const weiAmount = web3.utils.toWei(newRent, "ether");
    await contract.methods.changeRentCost(weiAmount).send({ from: account });
    showMessage(
      `Rent cost updated to ${newRent} ETH. All parties must re-sign.`,
      "success"
    );
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function changeDeposit() {
  const newDeposit = document.getElementById("newDeposit").value;
  if (!newDeposit) {
    showMessage("Please enter a deposit amount", "error");
    return;
  }

  try {
    const weiAmount = web3.utils.toWei(newDeposit, "ether");
    await contract.methods
      .changeDepositValue(weiAmount)
      .send({ from: account });
    showMessage(
      `Security deposit updated to ${newDeposit} ETH. All parties must re-sign.`,
      "success"
    );
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function changeManagementFee() {
  const newFee = document.getElementById("newManagementFee").value;
  if (!newFee) {
    showMessage("Please enter a management fee percentage", "error");
    return;
  }

  try {
    await contract.methods.changeManagementFee(newFee).send({ from: account });
    showMessage(
      `Management fee updated to ${newFee}%. All parties must re-sign.`,
      "success"
    );
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function changeStartDate() {
  const newStart = document.getElementById("newStartDate").value;
  if (!newStart) {
    showMessage("Please select a start date", "error");
    return;
  }

  try {
    const timestamp = Math.floor(new Date(newStart).getTime() / 1000);
    await contract.methods.changeStartDate(timestamp).send({ from: account });
    showMessage("Start date updated. All parties must re-sign.", "success");
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function changeEndDate() {
  const newEnd = document.getElementById("newEndDate").value;
  if (!newEnd) {
    showMessage("Please select an end date", "error");
    return;
  }

  try {
    const timestamp = Math.floor(new Date(newEnd).getTime() / 1000);
    await contract.methods.changeEndDate(timestamp).send({ from: account });
    showMessage("End date updated. All parties must re-sign.", "success");
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

function showMessage(msg, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = msg;
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 5000);
}

async function leaveContract() {
  if (
    !confirm(
      "Are you sure you want to leave this contract? A new person can take your place."
    )
  ) {
    return;
  }

  try {
    if (userRole === "tenant") {
      await contract.methods.leaveTenant().send({ from: account });
      showMessage(
        "You have left the contract. A new tenant can now sign.",
        "success"
      );
    } else if (userRole === "manager") {
      await contract.methods.leavePropertyManager().send({ from: account });
      showMessage(
        "You have left the contract. A new property manager can now sign.",
        "success"
      );
    }

    await determineUserRole();
    await loadContractStatus();
    await showRelevantSections();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Auto-refresh every 15 seconds
setInterval(() => {
  if (contract && account) {
    loadContractStatus();
    loadBalance();
    loadPaymentHistory();
  }
}, 15000);
