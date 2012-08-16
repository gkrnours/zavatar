/*
 * GET home page.
 */

var main = require("./main.js")
var ask = require("./ask.js")

this.setup = function setup(app){
	app.get("/", main.home)
	app.get("/login", main.signin)
	app.post("/login", main.login)
	
	app.get("/ask", ask.form)
	app.post("/ask", ask.process)
}


