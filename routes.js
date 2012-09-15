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
	
	app.get( "/ask", util.connected, ask.form)
	app.post("/ask", util.connected, ask.process)

	app.get( "/user/?", user.search)
	app.post("/user/?", user.searching)
	app.get( "/user/new/?", user.creator)
	app.post("/user/new/?", user.create)
	app.get( "/user/list/:keyword?", user.search)
	app.get( "/user/list/:by/:sort?", user.search)
	app.get( "/user/alter/:id", user.shape)
	app.post("/user/alter/:id", util.connected, user.alter)
	app.get( "/user/:id", util.connected, user.shape)
	app.get( "/user/:id", user.view)

	app.get( "/:part/:section?", talk.list)
	app.get( "/:part/:section/new", util.connected, talk.newt)
	app.post("/:part/:section/new", util.connected, talk.add)
	app.get( "/:part/:section/:key/message", util.connected, talk.message)
	app.post("/:part/:section/:key/message", util.connected, talk.reply)
	app.get( "/:part/:section/:key/image", util.connected, talk.image)
	app.post("/:part/:section/:key/image", util.connected, talk.reply)
	app.get( "/:part/:section/:key/:page?", talk.read)
}


