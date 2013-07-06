/*
 * GET home page.
 */

var express = require("express")
var admin   = require("adm")

this.setup = function setup(app){
	app.get( "/", function(req, res){ res.sendfile("/mnt/site/index.html") })

	app.get( "/admin",           admin.html)
	app.get( "/admin/page",      admin.page.html)
	app.post("/admin/page/create", admin.page.create)
	app.post("/admin/page/update", admin.page.update)
	app.post("/admin/page/delete", admin.page.destroy)
	app.get( "/admin/menu",      admin.menu.html)
	app.post("/admin/menu/create", admin.menu.create)
	app.post("/admin/menu/update", admin.menu.update)

}


