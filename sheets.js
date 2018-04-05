const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';
const bigInt = require("big-integer")
const { utils } = require('web3')



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Fetch last block from the Milestone triple check sheet
 * @see https://docs.google.com/spreadsheets/d/1laED9If2QT2K4ivXtTmsPXTz56VbYTxuXBhJN4QXqIE/edit#gid=982244464
 * 1uJnOn_zlmmg-2BmBxzYDc2EjUsf4DgfZqLxFUHNHRB8
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 */
const fetchLastBlock = (auth) => {
    return new Promise((resolve, reject) => {
        const sheets = google.sheets({ version: 'v4', auth })
        sheets.spreadsheets.get({
            spreadsheetId: '1uJnOn_zlmmg-2BmBxzYDc2EjUsf4DgfZqLxFUHNHRB8',
        }, (err, data) => {
            if (err) return reject(new Error('The API returned an error: ' + err))
            sheets.spreadsheets.values.get({
                spreadsheetId: '1uJnOn_zlmmg-2BmBxzYDc2EjUsf4DgfZqLxFUHNHRB8',
                range: data.data.sheets[0].properties.title
            }, (err, data ) => {
                if (err) return reject(new Error('The API returned an error: ' + err))
                if(data.data.values === undefined) return reject(new Error('There is no value in this sheet'))
                const rows = data.data.values;
                if (!rows.length) return reject(new Error('No data found.'))

                resolve(rows[0][1]); // B1 = last block
            });
        });
    });
}

/**
 * Fetch last block from the Milestone triple check sheet
 * @see https://docs.google.com/spreadsheets/d/1laED9If2QT2K4ivXtTmsPXTz56VbYTxuXBhJN4QXqIE/edit#gid=982244464
 * @param {OAuth2Client} auth The authenticated Google OAuth client.
 * @param {object} data  {
 *                         startBlock: xxxx,
 *                         endBlock: xxxx,
 *                         addresses: [],
 *                         amounts: [],
 *                         milestones: [{
 *                                        url: 'https://alpha.give....',
 *                                        campaign: 'DAPP'
 *                                     }],
 *                         inputData: '0x',
 *                         amountTotal: '0x',
 *                         ropstenTxHash: '0x'
 *                       }
 */
const createSheet = (auth, data) =>{
    return new Promise((resolve, reject) => {
        const sheets = google.sheets({ version: 'v4', auth });
        const title = data.startBlock + '-' + data.endBlock;

        sheets.spreadsheets.batchUpdate({
            spreadsheetId: '1laED9If2QT2K4ivXtTmsPXTz56VbYTxuXBhJN4QXqIE',
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title,
                                index: 0,
                            }
                        }
                    }
                ],
            }
        }, (err) => {
            if (err) return reject(new Error('The API returned an error: ' + err));

            rows = [];
            rows[0] = ['lastBlock', data.endBlock];
            rows[1] = ['inputData', data.inputData];
            rows[2] = ['amountTotal', '0x' + data.amountTotal.toString(16)];
            rows[3] = ['ropstenTx', `https://ropsten.etherscan.io/tx/${data.ropstenTxHash}`];
            rows[4] = ['Receiving Address', 'Amount in ETH', 'amount in wei', 'Receiving address Check', 'Checker #1', 'Checker #2', 'Do all links work', 'Exchange Service', 'Exchange rate', 'Exchange rate DATE', 'off by(in ETH)', 'test amount in wei', 'Ropsten Test Check', 'Campaign', 'Notes', 'Milestone'];

            const { addresses, amounts, milestones } = data;
            for (var i = 0; i < addresses.length; i++) {
                rows[i + 5] = [
                    addresses[i],
                    // utils.toBN(amounts[i]).divn(1e18).toString(),
                    amounts[i].divide(1e18).toString(),
                    amounts[i].toString(),
                    '',
                    '', // checker #1
                    '', // checker #2
                    '',
                    '',
                    '', // Exchange Rate
                    '', // Exchange Rate Date,
                    '', // off by in eth
                    '', // test amount
                    '', // ropsten test check
                    milestones[i].campaign,
                    '', // notes
                    milestones[i].url,
                ];
            }

            sheets.spreadsheets.values.update({
                spreadsheetId: '1laED9If2QT2K4ivXtTmsPXTz56VbYTxuXBhJN4QXqIE',
                range: `${title}!A1:P${data.addresses.length + 5}`,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: rows
                }
            }, (err, data) => {
                if (err) return reject(new Error('The API returned an error: ' + err));
                resolve(data);
            });
        });
    });
}


// Export all methods
module.exports = {
    authorize,
    createSheet,
    fetchLastBlock
  }
  