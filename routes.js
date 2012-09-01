/*
 * GET home page.
 */

var util = require("./util.js")
var main = require("./main.js")
var ask = require("./ask.js")
var talk = require("./talk.js")
var user = require("./user.js")

this.setup = function setup(app){
	app.get("/", main.home)
	app.get("/login", main.signin)
	app.post("/login", main.login)
	app.get("/logout", main.logout)
	
	app.get( "/ask", ask.form)
	app.post("/ask", ask.process)

	app.get( "/talk", talk.list)
	app.get( "/talk/:section/new", util.connected, talk.newt)
	app.post("/talk/:section/new", util.connected, talk.add)
	app.get( "/talk/:section/:key/message", util.connected, talk.message)
	app.post("/talk/:section/:key/message", util.connected, talk.reply)
	app.get( "/talk/:section/:key/image", util.connected, talk.image)
	app.post("/talk/:section/:key/image", util.connected, talk.reply)
	app.get( "/talk/:section/:key/:page?", talk.read)

	app.get( "/user/?", user.search)
	app.post("/user/?", user.searching)
	app.get( "/user/new/?", user.creator)
	app.post("/user/new/?", user.create)
	app.get( "/user/alter/:id", user.shape)
	app.post("/user/alter/:id", util.connected, user.alter)
	app.get( "/user/:id", user.shape)
	app.get( "/user/:id", user.view)
}


