var fora = require("./fora.js")
var bin  = require("./bin.js")

this.hasAccess = bin.read

this.linebreaksbr = function(txt){
	return txt.replace(/\n/g, "<br>")
}

this.json = function(txt, attr){
	return JSON.parse(txt)[attr]
}

this.page = function(thread){
	console.log(thread.length)
	return Math.floor(thread.length/10)
}
