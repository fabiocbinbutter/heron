export default `
{	function peek(x){console.log(x);return x}
    function Txt(txt){
    	this.txt = txt.join ? txt.join('') : txt
    	}
    Txt.prototype.toString = function(){return this.txt}
    let gid = 1
    function Id(id){
    	id = id.join ? id.join('') : id
        if(!id){id="*"}
        if(id.includes('*')){
        	id = id.replace("*",gid++)
        	}
    	this.id = id
    	}
    Id.prototype.toString = function(){return this.id}

    function Attr(ref,val){
    	this.ref = ref
        this.val = val
    	}
    function Obj(id,elems){
    	if(id){this.id = ''+id}
        this.txt = stringFromElements(elems)
        this.attr = attrsFromElements(id,elems)
        let {rels,data} = dataFromElements(id,elems)
        this.rels = rels
        this.data = data
    	}

    function unpair(pairs){
    	return pairs.reduce((arr,[a,b])=>[
        	...arr,
            ...(a!==null ? [a] : [] ),
            ...(b!==null ? [b] : [] )
            ],[])
    	}
    function stringFromElements(elems){
		let str=[]
        let attr={}
    	for(let el of elems){
			if(el instanceof Txt){
            	str.push(el.txt)
                continue
                }
			if(el instanceof Attr){
            	str.push('['+el.ref+']')
                attr[el.ref] = 'TODO'
                continue
				}
            if(el instanceof Obj){
            	str.push('['+el.id+']')
            	}
            }
        return str.join('')
    	}
    function attrsFromElements(path,elems){
    	if(!elems){return {}}
        let aEls = elems.filter(e=>e instanceof Attr)
        let attr = {}
        for(let el of aEls){
        	attr[el.ref] = el.val
        	}
        return attr
    	}
    function dataFromElements(path,elems){
    	let rels = {}
        let data = {}
    	for(let el of elems){
        	let obj, path
            if(el instanceof Obj){
            	obj = el
                path = el.id
                }
            if(el instanceof Attr && el.val instanceof Obj){
            	obj = el.val
                path = el.id.replace(/^\\?|^$/,el.ref+"?")
            	}
            if(obj){
                rels[path] = path
                let {...shallow} = obj
               	for(let [subId,subObj] of Object.entries(shallow.data)){
                    //for(let [loc,glb] of Object.entries(subObj.rels)){
                    //	subObj.rels[loc] = subId + '/' + glb
                   // 	}
                	data[path+'/'+subId] = subObj
                	}
                delete shallow.data
               	for(let [locl,glbl] of Object.entries(shallow.rels)){
                	shallow.rels[locl] = path+'/'+glbl
                	}
            	data[path] = shallow
            	}
        	}
        return {rels,data}
    	}
}

note = e:noteElement* {return new Obj('',e)}

noteElement
	= quoted
    / object
    / attribute
    / multiBreak
    / singleBreak
    / inlineBreak
    / objectWord
    / danglingBracket

quoted = "'...'" {return [T.TEXT, "STR"]}

object =
    "["
    id:objectId?
    rest:(singleBreak? objectElement)*
    "]"?
    {
    let elems = unpair(rest)
    return new Obj(id, elems)
    }

objectId =
	head:objectIdPart
    rest:("/" objectIdPart)*
    {return new Id(head + unpair(rest).join(''))}

objectIdPart = type:typeString id:("=" idString)? {
    return type + (id ? id[0]+id[1] : '')
    }

objectElement
	= object
	/ attribute
	/ objectWord

attribute =
	ref:typeString
    "="
    val:(object / quoted / text)
    {
		return new Attr(ref,val)
		}

text = ch:(escapedCharacter / textCharacter / inlineBreak)+
	{return new Txt(ch)}
 // ^ handle case where text ends with "\\n EOF"

objectWord = ch:wordCharacter+ {return new Txt(ch)}
typeString = ch:[^[\\n\\]=/ \\t]+ {return new Txt(ch)}
idString = ch:("+"? [0-9]*) {return new Txt(ch)}

inlineBreak = ch:" "+ {return new Txt(ch)}
singleBreak = ch:([\\n\\t][ \\t]*) {return new Txt(ch)}
multiBreak = ch:("\\n" "\\n"+) {return new Txt(ch)}

textCharacter = [^[\\n\\]]
wordCharacter = [^[\\n\\] \\t]
escapedCharacter = "\\\\" c:
	( selfEscape
	/ backslashEscape
	/ newlineEscape
	/ unicodeEscape
	) {return ch}

selfEscape = [/[\\]=\\"]
backslashEscape = "|" {return "\\\\"}
newlineEscape = "n" {return "\\n"}
unicodeEscape = "u" ch:([0-9a-fA-F]{0,6}) ";" {return String.fromCodePoint(parseInt(ch,16));}

danglingBracket = "]" {return new Txt("]")}

/*

jsonCompatibilityObject
	= "[{...}]"

jsonValue
	= quoted
	/ jsonObject

*/
`
