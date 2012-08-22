var redis = require("redis")
var r = new redis.createClient(process.env.RSPORT || 6379)
    r.auth(process.env.RSAUTH || "")
this.r = r

this.fora = {}
this.fora.create = function(who, where, what){
	who.thread = who.thread || 0
	who.post   = who.post   || 0
	when = new Date()
	key = who.uid+"_"+who.thread
	var ok = false;
	var request = r.multi()
	request.zadd(["forum:"+where+":list", when.getTime(), key])
	request.rpush(["thread:"+key+":messages", who.uid+"§"+what.opening])
	request.sadd(["thread:"+key+":people", who.uid])
	request.hmset([
			"thread:"+key+":data",
			"start", when.getTime(),
			"subject", what.subject,
			"length", 1])
	request.hincrby(["user:"+who.uid+":data", "thread", 1])
	request.hincrby(["user:"+who.uid+":data", "post",   1])
	request.exec(function(err){ console.log(err) })
}
