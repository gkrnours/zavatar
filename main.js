var wget = require("request")
var x2js = require("xml2js")
var redis = require("redis")
var p = new x2js.Parser()
var r = new redis.createClient()

this.home = function(req, res){
	tpl_val = {}//util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

this.signin = function(req, res){
	tpl_val = {}//util.mk_tpl_val(req)
	res.render("signin", tpl_val)
}

this.login = function(req, res){
	// read xml and co
	res.redirect("/login")
}
