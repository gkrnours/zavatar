var uuid = require("node-uuid")
var util = require("./util.js")
var fora = require("./fora.js")
var db   = require("./db.js")


this.list = function(req, res){
	var tpl_val = util.mk_tpl_val(req)
	res.render("talk_list", tpl_val)
}
this.read = function(req, res, next){
	var tpl_val = util.mk_tpl_val(req)
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
					tpl_val.messages.push(JSON.parse(rep[1]))
				var people = db.r.multi()
				for(ppl in rep[2]){
					console.log(rep[2][ppl])
					people.hgetall(["user:"+rep[2][ppl]+":data"])
				}
				people.exec(function(err, ppl){
					tpl_val.ppl = {}
					for(i in ppl){
						tpl_val.ppl[ppl[i]["uid"]] = ppl[i]
					}
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
		req.body.opening = fora.format(req.body.opening)
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
