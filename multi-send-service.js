#!/usr/bin/env node
/*Copyright (C) 2018 Arthur Lunn This program is free software: you 
  can redistribute it and/or modify it under the terms of the GNU General 
  Public License as published by the Free Software Foundation, version. 
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
  more details. You should have received a copy of the GNU General Public
  License along with this program. If not, see http://www.gnu.org/licenses/
  */
 const fs = require('fs');
 const readline = require('readline');
 const { google } = require('googleapis');
 const OAuth2Client = google.auth.OAuth2;
 const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
 const TOKEN_PATH = 'credentials.json';
 const bigInt = require("big-integer")
 const { utils } = require('web3')

 const { 
   processPacked, 
   processUnpacked,
   doMilestones
 } = require('./logic') 

 const { 
    authorize, 
    createSheet,
    fetchLastBlock
 } = require('./sheets') 
  

 let addresses = []
 let amounts = []
let data = {
    startBlock: undefined,
    endBlock: undefined,
    inputData: undefined,
    amountTotal: undefined,
    ropstenTxHash: undefined,
    addresses: [],
    amounts: [],
    milestones: []
}

/**
 * requires a client_secret.json in this directory. # https://developers.google.com/sheets/api/quickstart/nodejs#step_1_turn_on_the_api_name
 * run node sheets.js to authenticate for the first time, saving the credentials to disk
 * any other runs (assuming that authentication hasn't expired) will use the saved credentials.
 */

// Load client secrets from a local file.
fs.readFile('./client_secret.json', 'utf8', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    // authorize(JSON.parse(content), listMajors);
    // authorize(JSON.parse(content), (a) => auth = a);
    authorize(JSON.parse(content), async (auth) => {
        let lastBlock = await fetchLastBlock(auth)
        let milestoneData = getMilestoneData(lastBlock, 0, 40, true, null, true, false, "ap6KXg8iJwwUAxBY")   
        data.addresses = milestoneData[0]
        data.amounts = milestoneData[1] 
        data.infoStrings = milestoneData[2]
        data.endBlock = milestoneData[3]
        
        data.inputData = '0x2a17e3970000000000000000000000000000000000000000000000000000000000000020';
          inputData += web3.utils.padLeft(web3.utils.toHex(addresses.length).slice(2), 64)
          for(let i = 0; i < addresses.length; i++){
            inputData += address[i];
            inputData += web3.utils.padLeft(web3.utils.toHex(amounts[i]).slice(2), 24)
        }
        let txData = {
            to:  0x5FcC77CE412131daEB7654b3D18ee89b13d86Cbf,
            data: data.inputData,
            value: data.amountTotal,
            gasPrice: 40,
            gas: 700000
        }
        let signedTransactionData = await web3.eth.accounts.signTransaction(
            tx, 
            "0x43bed288a90702b9b0115a0347fd4ff220c77fe5296f5206c408fdd2e2dba871"
        )
        let tX = await web3.eth.sendSignedTransaction(signedTransactionData)
        data.ropstenTxHash = tX.transactionHash
        createSheet(auth, data)
    });
}); 
 
