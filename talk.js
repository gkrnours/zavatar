var uuid = require("node-uuid")
var util = require("./util.js")
var db   = require("./db.js")
var fora = require("./fora.js")


this.list = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	db.r.zrange(["forum:modo:list", 0, 20], function(err, threads){
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
				for(i=0; i<rep[1].length; ++i){
					tpl_val.messages.push(JSON.parse(rep[1][i]))
				}
				var people = db.r.multi()
				for(ppl in rep[2]){
					people.hgetall(["user:"+rep[2][ppl]+":data"])
				}
				people.exec(function(err, ppl){
					tpl_val.ppl = {}
					for(i in ppl){
						tpl_val.ppl[ppl[i]["uid"]] = ppl[i]
					}
					console.log(tpl_val.key)
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

		return res.redirect("/talk/modo/"+req.body.uid+"_"+req.body.post)
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

	db.r.hgetall("thread:"+req.params.key+":data", function(err, rep){
		tpl_val.thread = rep
		res.render("talk_image", tpl_val)
	})
}
this.reply = function(req, res, next){
	console.log(req.body)
	if(req.session.token != req.body.token) 
		return res.redirect("/talk/"+req.body.section+"/"+req.body.key)
	db.r.hgetall(["secure:"+req.body.token], function(err, rep){
		if(err) return next(err)
		if(req.body.kind == "message"){
			// manage adding a message
			var what = {author: rep.uid, message: req.body.message, kind:"message"}
			db.fora.add(req.session.me, req.body.key, what, function(err){
				if(err) return next(err)
			})
		}
		else if(req.body.kind == "image"){
			console.log(req.files)
			if(req.files)
				res.send(req.files)
			return
		}
		else{
			res.send(req.body)
			return
		}
		return res.redirect("/talk/"+req.body.section+"/"+req.body.key)
	})
}
