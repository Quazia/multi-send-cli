# Multi Send CLI

In order to get the interactive tool running just clone the repository locally

``` git clone https://github.com/Quazia/multi-send-cli.git ```

Once the repository is cloned just install npm packages and run the program

``` 
npm install

./multi-send.js 

```

A full list of options will be displayed.

Alternatively there's a script provided which will automatically push the data to google sheets.

To run this enter the following

```
./multi-send-service.js
```

This will create a milestone triple check, corresponding test send, and the raw input data in the following sheet:

https://docs.google.com/spreadsheets/d/1uJnOn_zlmmg-2BmBxzYDc2EjUsf4DgfZqLxFUHNHRB8/edit#gid=1384593258

This corresponds to the constant in sheets.js, to change to your own sheet just change `'1uJnOn_zlmmg-2BmBxzYDc2EjUsf4DgfZqLxFUHNHRB8'` to your own sheet.

Last block data is taken from cell B1 in the spreadsheet.