/*Copyright (C) 2018 Arthur Lunn This program is free software: you 
  can redistribute it and/or modify it under the terms of the GNU General 
  Public License as published by the Free Software Foundation, version. 
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
  more details. You should have received a copy of the GNU General Public
  License along with this program. If not, see http://www.gnu.org/licenses/
  */
require('es6-promise').polyfill();
require('isomorphic-fetch');
const bigInt = require("big-integer")
const assert = require('assert')
const Web3 = require('web3')
const provider = `wss://rinkeby.infura.io/ws`
const fs = require('fs')


let web3 = new Web3(new Web3.providers.WebsocketProvider(provider))

const HARDCODED_MILESTONE_ADDR =  "0x19Bd4E0DEdb9E5Ee9762391893d1f661404b561f"  // This needs to happen programagically

const HARDCODED_MULTISEND_ADDR =  "0x5FcC77CE412131daEB7654b3D18ee89b13d86Cbf"

const HARDCODED_MULTISIG_ADDR = "0x8f951903C9360345B4e1b536c7F5ae8f88A64e79"

const HARDCODED_MULTISIG_ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"removeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"revokeConfirmation","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"address"}],"name":"confirmations","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"isConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmationCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactions","outputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"executed","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"name":"","type":"address[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"from","type":"uint256"},{"name":"to","type":"uint256"},{"name":"pending","type":"bool"},{"name":"executed","type":"bool"}],"name":"getTransactionIds","outputs":[{"name":"_transactionIds","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getConfirmations","outputs":[{"name":"_confirmations","type":"address[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"transactionCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_required","type":"uint256"}],"name":"changeRequirement","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"confirmTransaction","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"destination","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitTransaction","outputs":[{"name":"transactionId","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_OWNER_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"required","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"newOwner","type":"address"}],"name":"replaceOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"transactionId","type":"uint256"}],"name":"executeTransaction","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_owners","type":"address[]"},{"name":"_required","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Confirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Revocation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Submission","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"Execution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"transactionId","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"OwnerRemoval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"required","type":"uint256"}],"name":"RequirementChange","type":"event"}]

const HARDCODED_MULTISEND_ABI = [{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"},{"name":"_amounts","type":"uint256[]"}],"name":"multiCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"},{"name":"_amounts","type":"uint256[]"}],"name":"multiTransfer","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"escapeHatchCaller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addressesAndAmounts","type":"bytes32[]"}],"name":"multiTransferTightlyPacked","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_addresses","type":"address[]"},{"name":"_amounts","type":"uint256[]"}],"name":"multiERC20Transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dac","type":"address"}],"name":"removeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwnerCandidate","type":"address"}],"name":"proposeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"isTokenEscapable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"escapeHatch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addressesAndAmounts","type":"bytes32[]"}],"name":"multiCallTightlyPacked","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"newOwnerCandidate","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newEscapeHatchCaller","type":"address"}],"name":"changeHatchEscapeCaller","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"escapeHatchDestination","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_addressesAndAmounts","type":"bytes32[]"}],"name":"multiERC20TransferTightlyPacked","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_value","type":"uint256"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"MultiTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_value","type":"uint256"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"MultiCall","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_value","type":"uint256"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_token","type":"address"}],"name":"MultiERC20Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"}],"name":"EscapeHatchBlackistedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EscapeHatchCalled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"by","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"OwnershipRemoved","type":"event"}]



const HARDCODED_MILESTONE_ABI = [
  {"constant":false,
  "inputs":[{"name":"idProject","type":"uint64"}],
  "name":"cancelMilestone",
  "outputs":[],
  "payable":false,"stateMutability":"nonpayable","type":"function"},
  {"constant":true,"inputs":[],
  "name":"escapeHatchCaller",
  "outputs":[{"name":"","type":"address"}],
  "payable":false,
  "stateMutability":"view",
  "type":"function"},
  {
    "constant":false,
    "inputs":[{"name":"_newOwner","type":"address"}],
    "name":"changeOwnership",
    "outputs":[],
    "payable":false,
    "stateMutability":"nonpayable","type":"function"
  },
  {
    "constant":true,
    "inputs":[{"name":"idProject","type":"uint64"}],
    "name":"getMilestone",
    "outputs":[{"name":"maxAmount","type":"uint256"},
    {"name":"received","type":"uint256"},
    {"name":"canCollect","type":"uint256"},
    {"name":"reviewer","type":"address"},
    {"name":"campaignReviewer","type":"address"},
    {"name":"recipient","type":"address"},
    {"name":"accepted","type":"bool"}],
    "payable":false,"stateMutability":"view","type":"function"},
    {
      "constant":false,
      "inputs":[{"name":"idProject","type":"uint64"}],
      "name":"acceptMilestone",
      "outputs":[],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "constant":false,
      "inputs":[{"name":"pledgesAmounts","type":"uint256[]"}],
      "name":"mWithdraw",  
      "outputs":[],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"function"
    },
      {"constant":false,"inputs":[{"name":"_dac","type":"address"}],"name":"removeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwnerCandidate","type":"address"}],"name":"proposeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"liquidPledging","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"isTokenEscapable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"escapeHatch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"idProject","type":"uint64"}],"name":"collect","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pledgeManager","type":"uint64"},{"name":"pledgeFrom","type":"uint64"},{"name":"pledgeTo","type":"uint64"},{"name":"context","type":"uint64"},{"name":"amount","type":"uint256"}],"name":"afterTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"url","type":"string"},{"name":"_maxAmount","type":"uint256"},{"name":"parentProject","type":"uint64"},{"name":"_recipient","type":"address"},{"name":"_reviewer","type":"address"},{"name":"_campaignReviewer","type":"address"}],"name":"addMilestone","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwnerCandidate","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"idProject","type":"uint64"},{"name":"idPledge","type":"uint64"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"pledgeManager","type":"uint64"},{"name":"pledgeFrom","type":"uint64"},{"name":"pledgeTo","type":"uint64"},{"name":"context","type":"uint64"},{"name":"amount","type":"uint256"}],"name":"beforeTransfer","outputs":[{"name":"maxAllowed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEscapeHatchCaller","type":"address"}],"name":"changeHatchEscapeCaller","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"escapeHatchDestination","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_liquidPledging","type":"address"},{"name":"_escapeHatchCaller","type":"address"},{"name":"_escapeHatchDestination","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"idProject","type":"uint64"}],"name":"MilestoneAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"idProject","type":"uint64"}],"name":"PaymentCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"}],"name":"EscapeHatchBlackistedToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"EscapeHatchCalled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"by","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"OwnershipRemoved","type":"event"}]





/**
 * @function  [processUnpacked]
 * @returns {String} Status
 */
const processUnpacked = (addresses, amounts, infoStrings) => {
  let addrStr = "["
  let amountStr = "["
  if(addresses.length != amounts.length){
    console.log("addresses should = amounts you dun goofed")
  }
  for(let i = 0; i < addresses.length; i++){
    console.log("Milestone" + infoStrings[i])
    console.log('Sending ' + ( amounts[i] / (10**18) ) + "ETH to " + addresses[i])
    addr = checkAddress(addresses[i])
    addrStr += addr
    amountStr += amounts[i]
    if(i != addresses.length - 1){
      addrStr += ", "
      amountStr += ", "
    }
  }
  addrStr += "]"
  amountStr += "]"
  console.log("addresses:" + addrStr)
  console.log("amounts:" + amountStr)
}


/**
 * @function  [processPacked]
 * @returns {String} Status
 */
const processPacked = (addresses, amounts) => {
  
  let mainString = "["
  let hexValue
  if(addresses.length != amounts.length){
    console.log("addresses should = amounts you dun goofed")
  }
  for(let i = 0; i < addresses.length; i++){
    console.log('Sending ' + ( amounts[i] / (10**18) ) + " ETH to " + addresses[i])
    addr = checkAddress(addresses[i])
    amount = convertAmount(amounts[i])
    hexValue = addr + amount
    mainString += hexValue
    if(i != addresses.length - 1){
      mainString += ", "
    }
  }
  mainString += "]"
  console.log(mainString)
}

const setupContract =  () => {
  return new web3.eth.Contract(HARDCODED_MILESTONE_ABI, HARDCODED_MILESTONE_ADDR)
}

const parseToCSV = (rows) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function(rowArray){
     let row = rowArray.join(",")
     csvContent += row + "\r\n" // add carriage return
  });
  return csvContent  
}



const generateMilestoneCSV = (addresses, amounts, infoStrings) => {
  rows = []
  for(let i = 0; i < amounts.length; i++){
    rows.push([addresses[i], amounts[i], infoStrings[i]])
  }

  fs.writeFile('./MilestoneOutput.csv', parseToCSV(rows), function (err) {
    if (err) throw err;
    console.log('All output added to MilestoneOutput.csv')
  });
}

const doMilestones = (startBlock, endBlock, packed, key, verify) => {
  let milestoneContract = setupContract()
  let addresses = []
  let amounts = []
  let amountTotal = new bigInt(0, 10)
  let infoStrings = []
  milestoneContract.getPastEvents('MilestoneAccepted',
    {fromBlock: startBlock,  toBlock: endBlock},
    async (error, logs) => {
    if (error) console.error(error);
    for(let i = 0; i < logs.length; i ++) {
      id = logs[i].returnValues.idProject
      let milestone = await milestoneContract.methods.getMilestone(id).call()
      // Make more efficient using roomId[$in]=2&roomId[$in]=5
      let dappBody = await fetch("https://feathersprod.giveth.io/milestones?projectId="+id)
      let dappJSON = await dappBody.json()
      let dappData = dappJSON.data[0] 
      dappAmount = dappData.maxAmount
      dappAddr = dappData.recipientAddress
      let infoString = "https://alpha.giveth.io/campaigns/"+dappData.campaign._id+"/milestones/"+dappData._id
      if(verify){
        if(dappAmount != milestone.maxAmount || dappAddr != milestone.recipient){
          console.log('Inconsistency found with sending ' + ( milestone.maxAmount / (10**18) ) + "ETH to " + milestone.recipient)
          console.log('DApp shows a send of ' + ( dappAmount / (10**18) ) + "ETH to " + dappAddr)
          console.log("Somebody in " + dappData.campaign.title +" dun screwed the pooch... \nCampaign ID: " + dappData.campaign._id + "\nMilestone ID: " + dappData._id)
          console.log("Check the milestone at " + infoString)
          continue
        }
      }
      // aggregate these data structures into an array of json objects
      amountTotal = amountTotal.add(milestone.maxAmount) 
      amounts.push(milestone.maxAmount)
      addresses.push(milestone.recipient)
      infoStrings.push(infoString)
    }
    if(packed){
      processPacked(addresses, amounts, infoStrings)
    } else {
      processUnpacked(addresses, amounts, infoStrings)
    }
    console.log("Total amount sent: " + amountTotal)
    generateMilestoneCSV(addresses, amounts, infoStrings)
  })
}

const checkAddress = (address) => {
  if(!address.match(/\b0x[0-9A-F]{40}\b/gi)){
    throw new Error("Oi, that's not an address m8, try harder!")
  }
  return address
}


const convertAmount = (amount) => {
  amount = bigInt(amount, 10)
  amount = amount.toString(16)
  if(amount.length > 16){
    throw new Error("hey, that's too many ethers d00d!")
  }
  amount = padZeroes(24, amount)
  return amount
}

const padZeroes = (length, value) => {
  while(value.length < length){
    value = "0" + value
  }
  return value
}

// Export all methods
module.exports = {
  doMilestones,   
  processPacked, 
  processUnpacked
}

