rules = [
	[/\*\*(.*)\*\*/g, "<b>$1</b>"],
	[/\/\/(.*)\/\//g, "<i>$1</i>"],
	[/\r\n/g, "<br>"],
]

this.format = function(txt){
	for(i=0; i<rules.length; ++i){
		txt = txt.replace(rules[i][0], rules[i][1])
	}
	return txt
}
this.slugish = function(txt){
	for(i=0; i<rules.length; ++i){
		txt = txt.replace(rules[i][0], "$1")
	}
	return txt
}
this.count = function(txt){
	txt = this.slugish(txt)
	return parseInt(txt.length, 10)
}
