/**
 * Module dependencies.
 */

var express = require("express")
var template= require("consolidate")
var rsStore = require("connect-redis")(express)
var routes  = require("./routes.js")
var http = require("http")

var app = express()
var views_dir = __dirname+"/data/views"

app.configure(function(){
	require("swig").init({cache: false, root: views_dir,autoescape: false,
		filters: require("./filters.js")})
	app.engine("html", template.swig)
	app.set("view engine", "html")
	app.set("views", views_dir)

	app.use(express.static(__dirname + '/public'));
	app.use("/css", express.static(__dirname+"/data/css"))
	app.use("/img", express.static(__dirname+"/data/img"))
	app.use("/js",  express.static(__dirname+"/data/js"))
	app.use("/avatar", express.static("/mnt/avatar"))
	app.use("/images", express.static("/mnt/images"))

	app.use(express.favicon("data/img/favicon.ico"));
	app.use(express.logger('tiny'));
	app.use(express.bodyParser({"hash":"sha1"}));
	app.use(express.cookieParser("greenish teddy"));
	app.use(express.session({store: new rsStore(), secret:"greenish teddy",
								cookie: {maxAge: 4*60*60*1000}}));
	app.use(app.router);
//	app.use(routes.err.gotcha) // check if the error is known
//	app.use(routes.err.generic)// throw pretty error at the user
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

routes.setup(app)

http.createServer(app).listen(process.env["port"] || 3000, function() {
	console.log("Express server listening on port " + app.get('port'));
});
