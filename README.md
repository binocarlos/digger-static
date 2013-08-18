digger-static
=============

A static digger supplier that selects the contents of xml, json and csv files in a folder

## installation

	$ npm install digger-static

## usage

```js
var static = require('digger-static');

var supplier = static({
	folder:__dirname + '/myfolder'
})

```

## licence

MIT