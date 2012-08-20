var util = require("./util.js")
var db   = require("./db.js")

this.shape = function(req, res){
	console.log("ping shape lvl"+req.params.id)
	tpl_val = util.mk_tpl_val(req)
	db.r.hgetall(["user:"+req.params.id+":data"], function(err, rep){
		if(rep == null){
			res.redirect("/user")
		}
		console.log(err)
		console.log(rep)
		if(err == null){
			tpl_val.him = rep
			return res.render("user_alter", tpl_val)
		}
	})
}
this.alter = function(req, res){
	// alter an user
}

this.view = function(req, res){

}
this.search = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	return res.render("user_search", tpl_val)
}
this.searching = function(req, res){
	console.log(req.body)
	res.redirect("/user/"+req.body.search)
}

