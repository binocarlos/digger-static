/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

var Supplier = require('digger-supplier');
var XML = require('digger-xml');
var csv = require('csv');
var fs = require('fs');
var path = require('path');

module.exports = function(options){

	options = options || {};

	var folder = options.folder;
	var file = options.file;

	if(file){
		if(!fs.existsSync(file)){
			throw new Error(file + ' does not exist');
		}	
	}
	else{
		if(!fs.existsSync(folder)){
			throw new Error(folder + ' does not exist');
		}	
	}

	var supplier = Supplier(options);

	supplier.on('select', function(req, reply){

		var fullpath = '';

		if(file){
			fullpath = file;
		}
		else{
			req.url = req.url.replace(/\.(\w+)\/.*$/, function(match, ext){
				return '.' + ext;
			})
			fullpath = path.normalize(folder + req.url);
		}

		fs.readFile(fullpath, 'utf8', function(error, content){
			if(error || !content){
				reply(error || 'no content');
			}
			else{
				if(req.url.match(/\.xml$/i) || content.match(/^\s*\</)){
					content = XML.parse(content);
				}
				else if(req.url.match(/\.csv/i)){
					csv()
						.from.string(content)
						.to.array(function(data){
						  content = data;
						});
				}
				else if(content.charAt(0)=='['){
					content = JSON.parse(content);
				}

				reply(null, content);
			}
		})
		
	})
	
	return supplier;
}