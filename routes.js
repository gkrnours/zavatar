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
	app.get("/logout", main.signin)
	
	app.get("/ask", ask.form)
	app.post("/ask", ask.process)

	app.get( "/user/:id", user.shape)
	app.post("/user/:id", user.alter)
	app.get("/user/:id", user.view)
	app.get("/user/?", user.search)
	app.post("/user", user.searching)
}


