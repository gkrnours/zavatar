var wget = require("request")
var x2js = require("xml2js")
var db   = require("./db.js")
var bin  = require("./bin.js")
var util = require("./util.js")
var p = new x2js.Parser()

function auto(){
}
function manual(req, res){
	ukey = "user:"+req.body.uid+":data"
	db.r.hgetall([ukey], function(err, rep){
		if(rep == null && typeof(process.env.DBHOST) == "undefined"){
			db.r.hmset(
				[ukey,
					"uid", req.body.uid,
					"pass", req.body.pass, 
					"access", bin.set(0, [1,2,3,4])],
				function(rep, err){
					console.log(rep)
					res.redirect("/?m=register")
				}
			)
			return
		}
		if(rep.pass == req.body.pass){
			req.session.me = rep
			res.redirect("/?m=connected")
			return
		}
		res.redirect("/login?e=nologin")
	})
}

this.home = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	res.render("home", tpl_val)
}

this.signin = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	console.log(tpl_val.me)
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
}
