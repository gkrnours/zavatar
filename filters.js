var fora = require("./fora.js")
var bin  = require("./bin.js")

this.hasAccess = bin.read
this.format = fora.format
this.foraAuthor = function(txt){
	uid = txt.split("§")[0]
	return uid
}
this.foraMessage = function(txt){
	r = txt.split("§")
	r.shift()
	r.shift()
	return r.join("§")
}

this.linebreaksbr = function(txt){
	return txt.replace(/\n/g, "<br>")
}
