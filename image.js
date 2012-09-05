var fs = require("fs")

var extension = {
	"image/gif": ".gif",
	"image/png": ".png",
	"image/jpg": ".jpg"
}

function slug(txt){
	txt = txt.replace(/\.\w{2,4}$/, "")
	txt = txt.replace(/\s|\W/, "")
	return txt
}

this.checkDir = function(){
	dir = ["avatar", "image", "pool"]
	for(i=0; i<dir.length; ++i){
		try{
			fs.readdirSync("/mnt/"+dir[i])
		}catch(e){
			fs.mkdirSync("/mnt/"+dir[i])
		}
	}
}

this.add = function(file, where, data){
	var ext = extension[file.mime] || ".jpg"
	var tgt = "/mnt/pool/"+file.hash+ext
	var dst = ""

	fs.renameSync(file.path, tgt)

	if(where == "avatar"){
		dst = "/avatar/"+slug(data)+ext
	} else if(where == "image"){
		dst = "/images/"+data+"-"+slug(file.name)+ext
	}
	fs.link(tgt, "/mnt"+dst)
	return dst
}
