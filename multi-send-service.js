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

const Web3 = require('web3')
const provider = `wss://rinkeby.infura.io/_ws`
let web3 = new Web3(new Web3.providers.WebsocketProvider(provider))

 
 const { 
   processPacked, 
   processUnpacked,
   doMilestones,
   getMilestoneData
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
try {
    fs.readFile('./client_secret.json', 'utf8', async (err, content) => {
        let lastBlock, signedTransactionData, tX, txData, auth
        if (err) throw 'Error loading client secret file:' + err
        
        try {
            auth = await authorize(JSON.parse(content))
        } catch (err) {
            console.log("Issue authorizing the secret with Google API: " + err)
            process.exit(1) 
        }
        console.log(auth)

        try {
            lastBlock = await fetchLastBlock(auth)
        } catch (err) {
            console.log('Error fetching last block:' + err)
            process.exit(1) 
        }

        try {
            milestoneData = await getMilestoneData(lastBlock, 0, 40, true, null, true, false, "ap6KXg8iJwwUAxBY")               
        } catch (error) {
            console.log('Error getting milestone data:' + err)          
            process.exit(1) 
        }

        data.addresses = milestoneData[0]
        data.amounts = milestoneData[1]
        data.infoStrings = milestoneData[2]
        data.endBlock = milestoneData[3]
        data.amountTotal = milestoneData[4]
        data.milestones = milestoneData[5]

        // Needs to be split out into a seperate function in logic.js
        data.inputData = '0x2a17e3970000000000000000000000000000000000000000000000000000000000000020'
        data.inputData += web3.utils.padLeft(web3.utils.toHex(data.addresses.length).slice(2), 64)
        for(let i = 0; i < data.addresses.length; i++){
            data.inputData += data.addresses[i].slice(2);
            data.inputData += web3.utils.padLeft(web3.utils.toHex(data.amounts[i]).slice(2), 24)
        }

        console.log("Transaction data: " + data.inputData)
        console.log("TotalAmount:" + data.amountTotal)
        
        txData = {
            to:  "0x5FcC77CE412131daEB7654b3D18ee89b13d86Cbf",
            data: data.inputData,
            value: data.amountTotal,
            gasPrice: 45000000000,
            gas: 700000
        }
        try {
            signedTransactionData = await web3.eth.accounts.signTransaction(
                txData, 
                "0x43bed288a90702b9b0115a0347fd4ff220c77fe5296f5206c408fdd2e2dba871"
            )            
        } catch (error) {
            console.log('Error signing transaction:' + error)
            process.exit(1) 
        }
        web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction)
        .on('transactionHash', (hash) => {
            data.ropstenTxHash = hash    
        })
        .on('error', (error) => {
            if(error.toString().indexOf("known transaction") >= 0){
                data.ropstenTxHash = error.toString().slice(43)
            } else {
                console.log('Error sending transaction:' + error)
                process.exit(1) 
            }
        })
        try {
            await createSheet(auth, data)
            process.exit(1)
        } catch (error) {
            console.log('issue creating sheet' + error);
            process.exit(1) 
        }
    }) // end readFile
} catch (error) {
    console.log(error)
    process.exit(1) 
}
 
