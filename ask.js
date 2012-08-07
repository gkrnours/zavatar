var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var p = new x2js.Parser()
var r = new redis.createClient()

this.form = function(req, res){
	tpl_val = {}//util.mk_tpl_val(req)
	res.render("ask_form", tpl_val)
}

this.process = function(req, res){
	res.send([
		req.body
		])
}

