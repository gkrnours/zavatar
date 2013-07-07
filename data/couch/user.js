{
	"validate_doc_update": function(doc, old, userCtx){
		if(!doc.uid) return
		if(!doc.access) throw({forbidden:"access required"})
		if(!doc.pass)   throw({forbidden:"pass required"})
	}
	"views": {
		"staff": {
			"map": function(doc){
					if(!doc.uid) return
					var admin = Math.floor(doc.access % 4 / 2)
					var modo  = Math.floor(doc.access % 8 / 4)
					if(admin || modo) emit(doc.name, doc)
				}
			}
		}
}
