var redis = require("redis")
this.r = new redis.createClient(process.env.RSPORT || 6379)
this.r.auth(process.env.RSAUTH || "")

