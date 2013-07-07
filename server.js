/**
 * Module dependencies.
 */

var express = require("express")
var template= require("consolidate")
var rsStore = require("connect-redis")(express)
var routes  = require("./routes.js")
var http = require("http")

var app = express()
var srv = http.createServer(app)
var views_dir = __dirname+"/assets/views"

app.configure(function(){
	require("swig").init({cache: false, root: views_dir,autoescape: false})
//		filters: require("./filters.js")})
	app.engine("html", template.swig)
	app.set("view engine", "html")
	app.set("views", views_dir)
	app.set("zzzyxa", "pit")

	app.use("/css", express.static(__dirname+"/assets/css"))
	app.use("/img", express.static(__dirname+"/assets/img"))
	app.use("/js",  express.static(__dirname+"/assets/js"))
	app.use(express.favicon("assets/img/favicon.ico"))

	app.use(express.logger('tiny'))
	app.use(express.bodyParser())
	app.use(express.cookieParser("greenish teddy"))
	app.use(express.session({
		store: new rsStore(), 
		secret:"greenish teddy", 
		cookie: {maxAge: 4*60*60*1000}
	}))
	app.use(app.router)
	app.use("/",    express.static("/mnt/site"))

//	app.use(routes.err.gotcha) // check if the error is known
//	app.use(routes.err.generic)// throw pretty error at the user
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

routes.setup(app)
srv.listen(process.env["port"] || 3000, function() {
	console.log("Express server listening on port " + srv.address().port);
});
