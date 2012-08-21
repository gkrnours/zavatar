function read(mask, bit){
	return 1 == Math.floor(mask/Math.pow(2, bit))%2
}
function set(mask, bit){
	mask = parseInt(mask,10)
	if(typeof(bit) == "object"){
		for(i=0;i<bit.length;++i){
			mask = set(mask, bit[i])
		}
		return mask
	}
	if(read(mask, bit))
		return mask
	else
		return mask + Math.pow(2,bit)
}
function unset(mask, bit){
	mask = parseInt(mask,10)
	if(typeof(bit) == "object"){
		for(i=0;i<bit.length;++i){
			mask = unset(mask, bit[i])
		}
		return mask
	}
	if(!read(mask, bit))
		return mask
	else
		return mask - Math.pow(2,bit)
}

this.read = read
this.set  = set
this.unset= unset
