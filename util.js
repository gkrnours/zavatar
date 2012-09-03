var crypto = require("crypto")
var db   = require("./db.js")
var err_txt = {} 

this.K = function(){}

this.process = function(flux){
	var id = flux.headers.game["@"].id
	var zone = flux.headers.owner.myZone
	var cpos = [flux.data.city["@"].x, flux.data.city["@"].y]
	var city  = flux.data.city["@"]
	var fmap  = flux.data.map

	var payload = []
	var l=fmap.zone.length

	payload.push(id+":city:name")
	payload.push(city.city)
	return payload
}
 
this.mk_tpl_val = function mk_tpl_val(req){
	tpl_val = {} 
	tpl_val.now = Date()
	tpl_val.env = process.env
	if(req && req.session) {
		tpl_val.ses = req.session
		if(req.session.me)
			tpl_val.me = req.session.me
	}
	if(req && req.query){
		if(req.query.e)
			tpl_val.error = err_txt && err_txt[req.query.e] || req.query.e
	}
	return tpl_val
}

this.md5 = function(str){
	return crypto.createHash("sha512").update(str).digest("hex")
}

this.connected = function(req, res, next){
	if(req && req.session && req.session.me)
		db.r.hgetall("user:"+req.session.me.uid+":data", function(err, rep){
			req.session.me = rep
			next()
		})
	else 
		return next("connexion required")
}
