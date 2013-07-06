document.on("dom:loaded", function(){
	$("u_page").on("change", function(ev, el){
		selected = el.childElements().find(function(el){return !!el.selected})
		data = selected.readAttribute("data-content").evalJSON()
		$("u_name").setValue(data.name)
		$("u_content").setValue(data.content)
	})
})
