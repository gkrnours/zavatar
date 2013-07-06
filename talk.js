var uuid = require("node-uuid")
var l    = require("logly")
var util = require("./util.js")
var db   = require("./db.js")
var fora = require("./fora.js")
var image= require("./image.js")


this.list = function(req, res){
	var section = req.params.section || "fixe"
	var tpl_val = util.mk_tpl_val(req)
	db.r.zrange(["forum:"+section+":list", 0, 20], function(err, threads){
		var request = db.r.multi()
		for(i in threads){
			request.hgetall(["thread:"+threads[i]+":data"])
		}
		request.exec(function(err, rep){
			tpl_val.list = rep
			res.render("talk_list", tpl_val)
		})
	})
}
this.read = function(req, res, next){
	var tpl_val = util.mk_tpl_val(req)
	    tpl_val.kye = req.params.key
	    tpl_val.sect = req.params.section
	var page = req.params.page || 0

	var request = db.r.multi()
	    request.hgetall(["thread:"+req.params.key+":data"])
			request.lrange(["thread:"+req.params.key+":messages",page*10,page*10+9])
			request.smembers(["thread:"+req.params.key+":people"])
			request.exec(function(err, rep){
				if(err) return next(err)

				tpl_val.data = rep[0]
				tpl_val.messages = []
				for(i=0; i<rep[1].length; ++i)
					tpl_val.messages.push(JSON.parse(rep[1][i]))

				if(rep[0] && 9 < rep[0].length){
					tpl_val.pages = []
					for(i=0; i<rep[0].length; i+=10)
						tpl_val.pages.push(i/10)
				}

				var people = []
				for(ppl in rep[2])
					people.push("user:"+rep[2][ppl])
				db.d.get(people, function(err, ppl){
					tpl_val.ppl = {}
					for(i in ppl)
						tpl_val.ppl[ppl[i].doc.uid] = ppl[i].doc
					return res.render("talk_read", tpl_val)
				})
			})
}

this.newt = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	var token = uuid.v4()
	tpl_val.token = token
	req.session.token = token
	db.r.hmset(["secure:"+token, "uid", req.session.me.uid])
	db.r.expire(["secure:"+token, 4*60])

	res.render("talk_new", tpl_val)
}
this.add = function(req, res, next){
	// check data
	if(req.session.token != req.body.token) return res.redirect("/talk")
	db.r.hgetall(["secure:"+req.body.token], function(err, me){
		if(err) return next(err)
		if(me.uid != req.body.uid) return res.redirect("/logout")
		// process thread
		if(1024 < fora.count(req.body.opening)) 
			return res.redirect("/talk/new?e=msgtoolong")
		if(64   < req.body.subject.length) {
			return res.redirect("/talk/new?e=subtoolong") 
		}
		// save
		var what = {}
				what.author = req.body.uid
				what.message = req.body.opening
				what.subject = req.body.subject
				what.kind = "message"
		db.fora.create(req.session.me, "modo", what)
		db.save // TODO

		return res.redirect("/talk/modo/"+req.body.uid+"_"+req.body.thread)
	})
}
this.message = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	var token = uuid.v4()
	tpl_val.token = token
	tpl_val.sect = req.params.section
	tpl_val.kye = req.params.key
	req.session.token = token
	db.r.hmset(["secure:"+token, 
			"uid", req.session.me.uid,
			"key", req.params.key,
			"section", req.params.section
	])
	db.r.expire(["secure:"+token, 4*60])

	db.r.hgetall("thread:"+req.params.key+":data", function(err, rep){
		tpl_val.thread = rep
		res.render("talk_message", tpl_val)
	})
}
this.image = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	var token = uuid.v4()
	tpl_val.token = token
	tpl_val.sect = req.params.section
	tpl_val.kye = req.params.key
	req.session.token = token
	db.r.hmset(["secure:"+token, 
			"uid", req.session.me.uid,
			"key", req.params.key,
			"section", req.params.section
	])
	db.r.expire(["secure:"+token, 4*60])

	var request = db.r.multi()
	request.hgetall(["thread:"+req.params.key+":data"])
	request.exec(function(err, rep){
		tpl_val.thread = rep[0]
		tpl_val.images = rep[1]
		res.render("talk_image", tpl_val)
	})
}

this.reply = function(req, res, next){
	db.r.hgetall(["secure:"+req.session.token], function(err, rep){
		if(err || !rep){ l.error(JSON.stringify(err)); return next(err) } // oops, token look bad

		// build data to save
		var what = {kind: req.body.kind, author: rep.uid}
		if(req.body.kind == "message"){
			what.message = req.body.message
		} 
		else if(req.body.kind == "image"){
			if(req.files && req.files.file && req.files.file.size != 0)
				what.url = image.add(req.files.file, "image", 0, req.session.me)
			else
				what.url = req.body.image
		} 

		db.fora.add(req.session.me, req.body.key, what, function(err){ 
			if(err) return next(err) 
		})

		db.r.hget(["thread:"+req.body.key+":data", "length"], function(err, rep){
			var url = "/talk/"+req.body.section+"/"+req.body.key
			return res.redirect(url+"/"+Math.floor(rep/10))
		})
	})
}
