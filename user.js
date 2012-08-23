var uuid = require("node-uuid")
var crypt= require("crypto")
var fs   = require("fs")
var util = require("./util.js")
var bin  = require("./bin.js")
var db   = require("./db.js")

this.shape = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	// check if the user exist. If not, throw the search page
	db.r.hgetall(["user:"+req.params.id+":data"], function(err, rep){
		if(rep == null){
			res.redirect("/user")
		}
		if(err == null){
			tpl_val.him = rep
			// make sure user don't manipulate data
			token = uuid.v4()
			req.session.token = token
			tpl_val.token = token
			db.r.hmset(["secure:"+token, "uid", req.params.id, "access", rep.access])
			db.r.expire(["secure:"+token, 4*60])
			return res.render("user_alter", tpl_val)
		}
	})
}
this.alter = function(req, res){
	// check if thing look legit
	if(req.session.token != req.body.token)	return res.redirect("/user")
	db.r.hgetall(["secure:"+req.body.token], function(err, him){
		// screw the user if an error occur or uid look bad
		if(err) return res.send(err)
		if(him.uid != req.body.uid) return res.redirect("/logout")
		// at this point, it should be ok to mess with the user
		var newA = him.access
		var payload = ["user:"+him.uid+":data"]
		// modo play here
		//TODO update session before altering user
		var can = bin.read(req.session.me.access, 2)
		if(can && req.body.name) payload.push("name", req.body.name)
		if(req.body.access)
			for(i=3;i<=5;++i){
				if(can && -1 < req.body.access.indexOf(""+i)) newA = bin.set(newA, i)
				else if(can) newA = bin.unset(newA, i)
			}
		// admin play here
		var can = bin.read(req.session.me.access, 1)
		if(can && req.body.pass) payload.push("pass", util.md5(req.body.pass))
		if(req.body.access)
			for(i=0;i<=2;++i){
				if(can && -1 < req.body.access.indexOf(""+i)) newA = bin.set(newA, i)
				else if(can) newA = bin.unset(newA, i)
			}
		payload.push("access", newA)

		db.r.hmset(payload, function(err, rep){
			if(err) console.log(err)
			return res.redirect("/user/"+him.uid)
		})
	})
}

this.view = function(req, res){

}
this.search = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	return res.render("user_search", tpl_val)
}
this.searching = function(req, res){
	console.log(req.body)
	res.redirect("/user/"+req.body.search)
}

this.view = function(){}
this.creator= function(req, res){
	var tpl_val = util.mk_tpl_val()
	res.render("user_creator", tpl_val)
}
this.create = function(req, res){
	var can  = (req.body.code == process.env.RSPORT)
	var full = (req.body.code == process.env.RSAUTH)
	if(full) can = true
	if(!can) return res.redirect("/user/new")

	var uid = req.body.uid
	var rnd = uuid.v4()
	fs.link(req.files.avatar.path, "/mnt/avatar/"+uid+"/"+rnd+".png")
	var payload = ["user:"+uid+":data"]
	    payload.push("uid", uid)
	    payload.push("avatar", "/avatar/"+uid+"/"+rnd+".png")
			payload.push("name", req.body.name)
			payload.push("pass", util.md5(req.body.pass))
	if(full){
			payload.push("access", bin.set(0, req.body.access))
	}else{
			payload.push("access", bin.set(0, [0, 3]))
	}
	db.r.hmset(payload)
	return res.redirect("/")
}
