var x2js = require("xml2js")
var wget = require("request")
var db   = require("./db.js")
var bin  = require("./bin.js")
var util = require("./util.js")
var p = new x2js.Parser()

function auto(){
}
function manual(req, res){
	ukey = "user:"+req.body.uid+":data"
	db.r.hgetall([ukey], function(err, rep){
		if(rep.pass == util.md5(req.body.pass) ){
			req.session.me = rep
			res.redirect("/?m=connected")
			return
		}
		if(rep)
			res.redirect("/login?e=nologin")
		else
			res.redirect("/login?e=noone")
	})
}

this.home = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

this.signin = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	res.render("signin", tpl_val)
}

this.login = function(req, res){
	if(req.body.kind == "manual")
		manual(req, res) 
	else
		auto(req, res)
}
this.logout = function(req, res){
	req.session.me = null
	res.redirect("/login")
}
