var util = require("./util.js")
var db   = require("./db.js")

this.form = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	res.render("ask_form", tpl_val)
}

this.process = function(req, res){
	// crunch data
	var what = {}
	    what.author = req.session.me.uid
			what.kind = "message"
			what.subject = "Demande de "+req.session.me.name
			what.message = req.body.desc
	var where = ["fixe","simple","film"][req.body.anim]

	db.fora.create(req.session.me, where, what)

	return res.redirect("/talk/"+where+"/"
			+req.session.me.uid+"_"+req.session.me.thread+"/0")
}

