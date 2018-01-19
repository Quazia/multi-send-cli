/*Copyright (C) 2018 Arthur Lunn This program is free software: you 
  can redistribute it and/or modify it under the terms of the GNU General 
  Public License as published by the Free Software Foundation, version. 
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
  more details. You should have received a copy of the GNU General Public
  License along with this program. If not, see http://www.gnu.org/licenses/
  */

const assert = require('assert')
const Web3 = require('web3')
const provider = `wss://rinkeby.infura.io/ws`

let web3 = new Web3(new Web3.providers.WebsocketProvider(provider))

const HARDCODED_MILESTONE_ADDR =  "0x19Bd4E0DEdb9E5Ee9762391893d1f661404b561f"  // This needs to happen programagically

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
const processUnpacked = (addresses, amounts) => {
  let addrStr = "["
  let amountStr = "["
  if(addresses.length != amounts.length){
    console.log("addresses should = amounts you dun goofed")
  }
  for(let i = 0; i < addresses.length; i++){
    console.log('Sending ' + amounts[i] + ' to ' + addresses[i])
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
    console.log('Sending ' + amounts[i] + ' to ' + addresses[i])
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

const doMilestones = (startBlock, endBlock, packed) => {
  let milestoneContract = setupContract()
  let addresses = []
  let amounts = []
  
  milestoneContract.getPastEvents('MilestoneAccepted',
    {fromBlock: startBlock,  toBlock: endBlock},
    async (error, logs) => {
    if (error) console.error(error);
    for(let i = 0; i < logs.length; i ++) {
      let milestone = await milestoneContract.methods.getMilestone(logs[i].returnValues.idProject).call()
      amounts.push(milestone.maxAmount)
      addresses.push(milestone.recipient)
    }
    if(packed){
      processPacked(addresses, amounts)
    } else {
      processUnpacked(addresses, amounts)
    }
  })
}

const checkAddress = (address) => {
  if(!address.match(/\b0x[0-9A-F]{40}\b/gi)){
    throw new Error("Oi, that's not an address m8, try harder!")
  }
  return address
}


const convertAmount = (amount) => {
  amount = parseInt(amount, 10)
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

