/*
 * GET home page.
 */

var main = require("./main.js")
var ask = require("./ask.js")

this.setup = function setup(app){
	app.get("/", main.home)
	app.get("/ask", ask.form)
}


