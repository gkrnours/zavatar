var util = require("./util.js")

this.form = function(req, res){
	tpl_val = util.mk_tpl_val(req)
	res.render("ask_form", tpl_val)
}

this.process = function(req, res){
	// crunch data
	//
	res.send([
		req.body
		])
}

