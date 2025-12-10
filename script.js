let web3;
let contract;
let account;
let CONTRACT_ADDRESS;
let CONTRACT_ABI;

window.onload = function () {
  const savedAddress = localStorage.getItem("contractAddress");
  const savedAbi = localStorage.getItem("contractAbi");

  if (savedAddress)
    document.getElementById("contractAddress").value = savedAddress;
  if (savedAbi) document.getElementById("contractAbi").value = savedAbi;

  if (savedAddress && savedAbi) {
    CONTRACT_ADDRESS = savedAddress;
    try {
      CONTRACT_ABI = JSON.parse(savedAbi);
    } catch (e) {
      showMessage("Invalid ABI format. Please check and save again.", "error");
    }
  }
};

function saveConfig() {
  const address = document.getElementById("contractAddress").value.trim();
  const abi = document.getElementById("contractAbi").value.trim();

  if (!address || !abi) {
    showMessage("Please provide both contract address and ABI", "error");
    return;
  }

  try {
    JSON.parse(abi);
    localStorage.setItem("contractAddress", address);
    localStorage.setItem("contractAbi", abi);
    CONTRACT_ADDRESS = address;
    CONTRACT_ABI = JSON.parse(abi);
    showMessage("Configuration saved successfully!", "success");
  } catch (e) {
    showMessage("Invalid ABI format. Please check your input.", "error");
  }
}

async function connectWallet() {
  if (!CONTRACT_ADDRESS || !CONTRACT_ABI) {
    showMessage("Please configure contract address and ABI first!", "error");
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

      document.getElementById("statusCard").style.display = "block";
      document.getElementById("balanceCard").style.display = "block";
      document.getElementById("actionsCard").style.display = "block";
      document.getElementById("historyCard").style.display = "block";

      showMessage("Wallet connected successfully!", "success");

      await loadContractStatus();
      await loadBalance();
      await loadPaymentHistory();

      ethereum.on("accountsChanged", (accounts) => {
        account = accounts[0];
        loadContractStatus();
        loadBalance();
      });
    } catch (error) {
      showMessage("Error connecting wallet: " + error.message, "error");
    }
  } else {
    showMessage("Please install MetaMask!", "error");
    window.open("https://metamask.io/download/", "_blank");
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
    const houseAddress = await contract.methods.houseAddress().call();
    const active = await contract.methods.active().call();
    const tenantAgreed = await contract.methods.tenantAgreed().call();
    const managerAgreed = await contract.methods.propertyManagerAgreed().call();
    const depositPaid = await contract.methods.depositPaid().call();
    const depositHeld = await contract.methods.depositHeld().call();
    const start = await contract.methods.start().call();
    const end = await contract.methods.end().call();

    const startDate = new Date(Number(start) * 1000).toLocaleDateString();
    const endDate = new Date(Number(end) * 1000).toLocaleDateString();

    document.getElementById("contractStatus").innerHTML = `
                    <div class="status-item">
                        <label>Property Address</label>
                        <div class="value">${houseAddress}</div>
                    </div>
                    <div class="status-item">
                        <label>Contract Status</label>
                        <div class="value">
                            <span class="status-badge ${
                              active ? "status-active" : "status-pending"
                            }">
                                ${active ? "Active" : "Pending"}
                            </span>
                        </div>
                    </div>
                    <div class="status-item">
                        <label>Monthly Rent</label>
                        <div class="value">${web3.utils.fromWei(
                          rentCost,
                          "ether"
                        )} ETH</div>
                    </div>
                    <div class="status-item">
                        <label>Security Deposit</label>
                        <div class="value">${web3.utils.fromWei(
                          deposit,
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
                          depositHeld,
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
                        <div class="value status-${
                          tenantAgreed ? "yes" : "no"
                        }">
                            ${tenantAgreed ? "Yes" : "No"}
                        </div>
                    </div>
                    <div class="status-item">
                        <label>Manager Agreed</label>
                        <div class="value status-${
                          managerAgreed ? "yes" : "no"
                        }">
                            ${managerAgreed ? "Yes" : "No"}
                        </div>
                    </div>
                    <div class="status-item">
                        <label>Deposit Paid</label>
                        <div class="value status-${depositPaid ? "yes" : "no"}">
                            ${depositPaid ? "Yes" : "No"}
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
      balance,
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
    await contract.methods.signAsTenant().send({ from: account });
    showMessage("Successfully signed as tenant!", "success");
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function signAsManager() {
  try {
    await contract.methods.signAsPropertyManager().send({ from: account });
    showMessage("Successfully signed as property manager!", "success");
    await loadContractStatus();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function payDeposit() {
  try {
    const deposit = await contract.methods.securityDeposit().call();
    await contract.methods.payDeposit().send({
      from: account,
      value: deposit,
    });
    showMessage("Security deposit paid successfully!", "success");
    await loadContractStatus();
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
  if (!confirm("Are you sure you want to terminate the contract?")) return;

  try {
    await contract.methods.terminateContract().send({ from: account });
    showMessage("Contract terminated", "success");
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

setInterval(() => {
  if (contract && account) {
    loadContractStatus();
    loadBalance();
    loadPaymentHistory();
  }
}, 15000);
