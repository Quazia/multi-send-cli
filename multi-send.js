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


const program = require('commander')
var inquirer = require('inquirer')
const bigInt = require("big-integer")


const { 
  processPacked, 
  processUnpacked,
  doMilestones
} = require('./logic') 

const packingQs = [
  {
    type : 'input',
    name : 'address',
    message : 'Enter address ..'
  },
  {
    type : 'input',
    name : 'amount',
    message : 'Enter amount (in wei) ..'
  },
  {
    type : 'confirm',
    name : 'continue',
    message : 'Would you like to add another???'
  }
]


const milestoneQs = [
  {
    type : 'input',
    name : 'startBlock',
    message : 'Enter start block ..'
  },
  {
    type : 'input',
    name : 'endBlock',
    message : 'Enter end block ..'
  },
  {
    type : 'input',
    name : 'milestoneDepth',
    message : 'Enter max number of milestones ..'
  },
  {
    type : 'confirm',
    name : 'packed',
    message : 'Would you like these packed?'
  },
  {
    type : 'confirm',
    name : 'doSend',
    message : 'Would you like to send to the multi-sig?'
  },
  {
    type : 'confirm',
    name : 'doVerify',
    message : 'Would you like to check against the DApp?'
  },
  {
    type: 'confirm',
    name: 'isTest',
    message: 'Is this a test send..'
  },
  {
    // Need full implementation
    type: 'list',
    name: 'project',
    message: 'What project would you like to get milestones from?',
    choices: ['ScalingNow']
  }
  /*,
  {
    type : 'confirm',
    name : 'checkDups',
    message : 'Would you like to check for duplicate amounts?' 
  }*/
]

const askKey = [
  {
    type : 'input',
    name : 'pKey',
    message : 'please enter your key'
  }
]


let addresses = []
let amounts = []

function askPacking(status) {
  inquirer.prompt(packingQs).then(answers => {
    addresses.push(answers.address)
    amounts.push(answers.amount)
    if (answers.continue) {
      askPacking()
    } else {
      if(status == 'u'){
        processUnpacked(addresses, amounts)
      } else {
        processPacked(addresses, amounts)          
      }
    }
  })
}


async function askMilestones(status) {
  let answers = await inquirer.prompt(milestoneQs)
  if(answers.doSend){
    let keyAnswer = await inquirer.prompt(askKey)
    let milestoneData = getMilestoneData(answers.startBlock, answers.endBlock, answers.milestoneDepth, answers.packed, keyAnswer.pKey, answers.doVerify, answers.isTest, "ap6KXg8iJwwUAxBY")
  } else {
    let milestoneData = getMilestoneData(answers.startBlock, answers.endBlock, answers.milestoneDepth, answers.packed, null, answers.doVerify, answers.isTest, "ap6KXg8iJwwUAxBY")    
  }
  doMilestones(milestoneData[0], milestoneData[1], milestoneData[2], startBlock, milestoneData[3])
}

program
  .version('0.0.1')
  .description('Giveth Multi-Send CLI - Made with <3 and Duct Tape')

program
  .command('addAddressesUnpacked')
  .alias('u')
  .description('Add a series of addresses unpacked')
  .action(() => {
    askPacking('u')
  })


program
  .command('addAddressesPacked')
  .alias('p')
  .description('Add a series of addresses packed')
  .action(() => {
    askPacking('p')
  })

  program
  .command('getMilestoneString')
  .alias('m')
  .description('Scrape the Giveth web app for payouts in a certain range of blocks')
  .action(() => {
    askMilestones()
  })


// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[mup]/.test(process.argv.slice(2))) {
  program.outputHelp()
  process.exit()
}

program.parse(process.argv)
