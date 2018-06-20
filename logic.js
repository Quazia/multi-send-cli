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
const assert = require('assert')
const Web3 = require('web3')
const provider = `wss://rinkeby.infura.io/_ws`
const fs = require('fs')


let web3 = new Web3(new Web3.providers.WebsocketProvider(provider))

let BN = Web3.utils.BN

let amountTotal = new BN(0)


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
  console.log("Total amount sent: " + String(amountTotal))
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
  console.log("Total amount sent: " + String(amountTotal))  
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
  console.log("Total amount sent: " + String(amountTotal))
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



const generateMilestoneCSV = (addresses, amounts, infoStrings, startBlock, endBlock) => {
  rows = []
  for(let i = 0; i < amounts.length; i++){
    rows.push([addresses[i], amounts[i], infoStrings[i]])
  }

  fs.writeFile('./MilestoneOutput' + startBlock + '-' + endBlock + '.csv', parseToCSV(rows), function (err) {
    if (err) throw err;
    console.log('All output added to MilestoneOutput' + startBlock + '-' + endBlock + '.csv')
  });
}

const getCampaigns = async () => {
  let campaignsJSON = await fetch('https://feathers.alpha.giveth.io/campaigns?$select[]=title&$select[]=_id')
  return campaignsJSON.data
}

const getCampaignTitleArray = ( campaignJSON ) => {
  let campaignArray
  for(i = 0; i < campaignJSON.length; i++){
    campaignArray.push(campaignJSON[i].title)
  }
  return campaignArray
}

const getCampaignID = (campaignTitle, campaignJSON) => {
  for(i = 0; i < campaignJSON.length; i++){
    if (campaignJSON[i].title === campaignTitle){
      return campaignJSON[i]._id
    }
  }
  return null
}

const getMilestoneData = (startBlock, endBlock, milestoneDepth, packed, key, verify, test, campaignIDs) => {
  return new Promise(async function(resolve, reject) {
    if(endBlock < startBlock){
      endBlock = web3.eth.blockNumber
    }
    let milestoneContract = setupContract()
    let addresses = []
    let amounts = []
    let infoStrings = []
    let milestones = []
    let currentBlock = startBlock
    try {
      await milestoneContract.getPastEvents('MilestoneAccepted',
        {fromBlock: startBlock,  toBlock: endBlock},
        async (error, logs) => {
        if (error) console.error(error);
        for(i = 0; i < logs.length && i < milestoneDepth; i ++) {
          id = logs[i].returnValues.idProject
          
          // Make more efficient using roomId[$in]=2&roomId[$in]=5
          let dappBody, dappJSON, milestone
          try {
            milestone = await milestoneContract.methods.getMilestone(id).call()
            currentBlock = logs[i].blockNumber
            dappBody = await fetch("https://feathers.alpha.giveth.io/milestones?projectId=" + id)
            dappJSON = await dappBody.json()
          } catch (error) {
            console.log("issue with project ID: " + id)
            continue
          }
          let dappData = dappJSON.data[0]
          if(campaignIDs.indexOf(dappData.campaign._id) === -1){
            continue
          }
          let dappAmount = new BN(dappData.maxAmount, 10)
          console.log("Initial Amount: " + dappAmount)
          let dappAmountAdjustment = dappAmount.mod(new BN(100000000,10))
          console.log("Adjustment Amount: " + dappAmountAdjustment)
          dappAmount =  dappAmount.sub(dappAmountAdjustment)
          console.log("New Amount: " + dappAmount)
          let dappAddr = dappData.recipientAddress
          let infoString = "https://alpha.giveth.io/campaigns/"+dappData.campaign._id+"/milestones/"+dappData._id
          if(verify){
            if(dappData.maxAmount != milestone.maxAmount || dappAddr != milestone.recipient){
              console.log('Inconsistency found with sending ' + ( web3.utils.fromWei(dappData.maxAmount).toString() ) + "ETH to " + milestone.recipient)
              console.log('DApp shows a send of ' + ( web3.utils.fromWei(dappData.maxAmount).toString() ) + "ETH to " + dappAddr)
              console.log('Main chain shows a send of ' + ( web3.utils.fromWei(milestone.maxAmount).toString() ) + "ETH to " + milestone.recipient)
              console.log("Somebody in " + dappData.campaign.title +" dun screwed the pooch... \nCampaign ID: " + dappData.campaign._id + "\nMilestone ID: " + dappData._id)
              console.log("Check the milestone at " + infoString)
              continue
            }
          }
          milestone.url = infoString
          milestone.campaign = dappData.campaign.title
          console.log("Milestone block is " + currentBlock)
          milestones.push(milestone)
          // aggregate these data structures into an array of json objects
          if(test){
            amounts.push(dappAmount.divide(10**8))        
          }
          else{
            amounts.push(dappAmount)
          }
          addAmount(amounts[amounts.length-1])
          addresses.push(milestone.recipient)
          infoStrings.push(infoString)
        }
        resolve([addresses, amounts, infoStrings, currentBlock, amountTotal, milestones]);
      })  
    } catch (error) {
      reject(error)
    }
  });
}
const doMilestones = (addresses, amounts, infoStrings, startBlock, currentBlock) => {
  if(packed){
    processPacked(addresses, amounts, infoStrings)
  } else {
    processUnpacked(addresses, amounts, infoStrings)
  }
  generateMilestoneCSV(addresses, amounts, infoStrings, startBlock, currentBlock)
}


const checkAddress = (address) => {
  if(!address.match(/\b0x[0-9A-F]{40}\b/gi)){
    throw new Error("Oi, that's not an address m8, try harder!")
  }
  return address
}


const addAmount = (amount) => {
  bnAmount = new BN(amount, 10)
  /*if(bnAmount.gt((new BN(2)).pow(96).sub(1))){
    throw new Error("hey, that's too many ethers d00d!  " + bnAmount)
  }*/
  console.log("Total amount: " + amountTotal)
  console.log("Amount to add: " + bnAmount)
  amountTotal = amountTotal.add(bnAmount)
}


// Export all methods
module.exports = {
  doMilestones,   
  processPacked, 
  processUnpacked,
  getCampaigns,
  getCampaignID,
  getCampaignTitleArray,
  getMilestoneData
}

