var fora  = require("./fora.js")
var redis = require("redis")
var r = new redis.createClient(process.env.RSPORT || 6379)
    r.auth(process.env.RSAUTH || "")
this.r = r

this.fora = {}
this.fora.create = function(who, where, what){
	who.thread = who.thread || 0
	who.post   = who.post   || 0
	when = new Date()
	what.message = fora.format(what.message)
	key = who.uid+"_"+who.thread

	var request = r.multi()
	request.zadd(["forum:"+where+":list", when.getTime(), key])
	request.rpush(["thread:"+key+":messages", JSON.stringify(what)])
	request.sadd(["thread:"+key+":people", who.uid])
	request.hmset([
			"thread:"+key+":data",
			"link", "/talk/"+where+"/"+key,
			"last", when.getTime(),
			"start", when.getTime(),
			"subject", what.subject,
			"author", who.uid,
			"length", 1])
	request.hincrby(["user:"+who.uid+":data", "thread", 1])
	request.hincrby(["user:"+who.uid+":data", "post",   1])
	request.exec(function(err){ if(err) console.log("oops"); console.log(err) })
}
this.fora.add = function(who, where, what, next){
	console.log(arguments)
	who.post   = who.post   || 0
	when = new Date()
	what.message = fora.format(what.message)
	key = "thread:"+where+":"

	var request = r.multi()
	request.rpush([key+"messages", JSON.stringify(what)])
	request.sadd([key+"people", who.uid])
	request.hincrby([key+"data", "length", 1])
	request.hset([key+"data", "last", when.getTime()])
	request.exec(function(err){ if(err) console.log(err); next(err) })

	if(what.kind == "message")
		r.hincrby(["user:"+who.uid+":data", "post",   1])
	else if(what.kind == "image")
		r.hincrby(["user:"+who.uid+":data", "image",   1])
}
