var util = require("./util.js")
var db   = require("./db.js")

this.shape = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	db.r.hgetall(["user:"+req.params.id+":data"], function(err, rep){
		if(err == null){
			tpl_val.him = rep
			return res.render("shape", tpl_val)
		}
		console.log(err)
		console.log(rep)
	})
}
this.alter = function(req, res){
	// alter an user
}

this.view = function(req, res){

}

