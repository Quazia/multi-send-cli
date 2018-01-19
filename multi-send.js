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
    message : 'Enter amount ..'
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
  }

]

let addresses = []
let amounts = []

function askPacking(status) {
  inquirer.prompt(packingQs).then(answers => {
    addresses.push(answers.address)
    amounts.push(answers.amount)
    if (answers.continue) {
      ask()
    } else {
      for(let i =0; i < addresses.length; i++){
        console.log('Sending ' + amounts[i] + ' to ' + addresses[i])
      }
      if(status == 'u'){
        processUnpacked(addresses, amounts)
      } else {
        processPacked(addresses, amounts)          
      }
    }
  })
}


function askMilestones(status) {
  inquirer.prompt(milestoneQs).then(answers => {
    doMilestones(answers.startBlock, answers.endBlock)
  })
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
  .description('pull Milestone data from last string')
  .action(() => {
    askMilestones()
  })


// Assert that a VALID command is provided 
if (!process.argv.slice(2).length || !/[mup]/.test(process.argv.slice(2))) {
  program.outputHelp()
  process.exit()
}

program.parse(process.argv)
