/*
 * GET home page.
 */

var util = require("./util.js")
var main = require("./main.js")
var user = require("./user.js")
var ask = require("./ask.js")

this.setup = function setup(app){
	app.get("/", main.home)
	app.get("/login", main.signin)
	app.post("/login", main.login)
	
	app.get("/ask", ask.form)
	app.post("/ask", ask.process)

	app.get( "/user/:id", util.isAdmin, user.shape)
	app.post("/user/:id", util.isAdmin, user.alter)
	app.get("/user/:id", user.view)
}


