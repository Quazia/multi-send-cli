/*Copyright (C) 2018 Arthur Lunn This program is free software: you 
  can redistribute it and/or modify it under the terms of the GNU General 
  Public License as published by the Free Software Foundation, version. 
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
  more details. You should have received a copy of the GNU General Public
  License along with this program. If not, see http://www.gnu.org/licenses/
  */
const assert = require('assert'); // N.B: Assert module comes bundled with NodeJS.

/**
 * @function  [processUnpacked]
 * @returns {String} Status
 */
const processUnpacked = (addresses, amounts) => {
  let addrStr = "[";
  let amountStr = "[";
  if(addresses.length != amounts.length){
    console.log("addresses should = amounts; you dun goofed")
  }
  for(let i = 0; i < addresses.length; i++){
    addr = checkAddress(addresses[i]);
    addrStr += addr;
    amountStr += amounts[i];
    if(i != addresses.length - 1){
      addrStr += ", ";
      amountStr += ", ";
    }
  }
  addrStr += "]";
  amountStr += "]";
  console.log("addresses:" + addrStr);
  console.log("amounts:" + amountStr);
};


/**
 * @function  [processPacked]
 * @returns {String} Status
 */
const processPacked = (addresses, amounts) => {
  let mainString = "[";
  let hexValue;
  if(addresses.length != amounts.length){
    console.log("addresses should = amounts; you dun goofed")
  }
  for(let i = 0; i < addresses.length; i++){
    addr = checkAddress(addresses[i]);
    amount = convertAmount(amounts[i]);
    hexValue = addr + amount;
    mainString += hexValue;
    if(i != addresses.length - 1){
      mainString += ", ";
    }
  }
  mainString += "]";
  console.log(mainString);
};

const checkAddress = (address) => {
  if(!address.match(/\b0x[0-9A-F]{40}\b/gi)){
    throw new Error("Oi, that's not an address m8, try harder!");
  };
  return address;
}


const convertAmount = (amount) => {
  amount = parseInt(amount, 10);
  amount = amount.toString(16);
  if(amount.length > 16){
    throw new Error("hey, that's too many ethers d00d!");
  };
  amount = padZeroes(24, amount);
  return amount;
}

const padZeroes = (length, value) => {
  while(value.length < length){
    value = "0" + value;
  }
  return value;
}

// Export all methods
module.exports = {   
  processPacked, 
  processUnpacked
};

