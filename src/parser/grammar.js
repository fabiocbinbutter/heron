
exports = module.exports = functionBodies`${grammarScript}

note = elems:noteElement* ${f=>{
	return new Obj(new Id('_note=+') ,elems)
	}}

noteElement
	= quoted
	/ object
	/ attribute
	/ word
	/ _top_
	/ danglingBracket

quoted = "\\"...\\"" ${f=>{
	return new  Txt("TODO")
	}}

object =
	"["
	id:objectId?
	rest:(_obj_? objectElement)*
	_obj_? "]"?
	${f=>{
		return new Obj(id, rest.map(r=>r[1]))
		}}

objectId =
	head:objectIdPart
	rest:objectIdRest*
	${f=>{
		return new Id([head, ...rest])
		}}

objectIdRest =
	"/"
	part:objectIdPart
	${f=>{
		return part
		}}

objectIdPart =
	type:typeString
	id:("=" idNumString)?
	${f=>{
		return type + (id||[]).join('')
		}}

objectElement
	= object
	/ attribute
	/ objectText

attribute =
	ref:typeString
	"="
	val:(object / quoted / objectText)
	${f=>{
		return new Attr(ref,val)
		}}

topLevelText = ch:(rootCharacter/escapedCharacter)+
	${chJoin}

objectText =
	head:word
	rest:(_txt_ word)*
	${f=>{
		return rest.reduce((a,b)=>([...a,...b]),[head]).join('')
		}}


word = ch:(wordCharacter/escapedCharacter)+ ${chJoin}

typeString = //Anything but whitespace,brackets,=, or /
	ch:[^ \\n\\t[\\]=/]+
	${chJoin}

idNumString = //Examples: "1" "12" "" "+" "+1"
	ch:("+"? [0-9]*)
	${chJoin}

_txt_
	= singleSpace
	/ lineContinuations
	/ nothing

_obj_
	= multiSpace
	/ lineContinuations
	/ singleBreak
	/ nothing

_top_
	= ch:[ \\n\\t]+ ${chJoin}

wordCharacter = [^ \\n\\t\\[\\]] // Anything but whitespace, opening bracket, or closing bracket
rootCharacter = [^[] //Anything but an opening bracket
singleSpace = " "
multiSpace = ch:[ \t]+ ${chJoin}
singleBreak = ch:(
	[\\t ]*
	"\\n"
	[\\t ]*
	) ${chJoin}
lineContinuations = ch:lineContinuation+ ${chJoin}
lineContinuation =
	ch1:[\\t ]*
	"\\n"
	[ \\t]*
	"|"
	ch2:[\\t ]*
	${f=>{
		ch1.join('')+'\\n'+ch2.join('')
		}}
nothing = ""

escapedCharacter = "\\\\" ch:
	( selfEscape
	// backslashEscape
	/ newlineEscape
	/ unicodeEscape
	) {return ch}

selfEscape = [/[\\]=\\"\\\\|]
//backslashEscape = "\\" {return "\\\\"}
newlineEscape = "n" {return "\\n"}
unicodeEscape = "u" ch:([0-9a-fA-F]{0,6}) ";" ${ f=>{return String.fromCodePoint(parseInt(ch,16));}}

danglingBracket = "]" {return "]"}

/*

jsonCompatibilityObject
	= "[{...}]"

jsonValue
	= quoted
	/ jsonObject

*/`


function grammarScript(){
	let gid = 1
	function Id(spec = ''){
		let parts =
			spec instanceof Id ? spec.parts
			: spec.split ? spec.split('/')
			: spec
		if(parts[0][0]==='@'){
			parts[0] = parts[0].slice(1)
			parts.unshift('@')
			}
		this.parts = parts.map(part => part instanceof IdPart ? part : new IdPart(part))
		return this
		}
	Id.prototype.toString = function(){return this.parts.map(p=>p.toString()).join('/')}
	Id.prototype.toJSON = function(){return JSON.stringify(this.toString())}
	Id.prototype.toAst = function(){return ['Id', this.toString()]}
	Id.prototype.concat = function(partOrParts){
		let parts
			= partOrParts instanceof Id ? partOrParts.parts
			: Array.isArray(partOrParts) ? partOrParts
			: [partOrParts]
		return new Id([...this.parts, ...parts])
		}
	Id.prototype.isRelative = function(){return this.parts[0]==='@'}

	function IdPart(str){
			str = str.includes('=') ? str : str+"=+";
			if(str.slice(-2)==="=+"){str+=(gid++)}
			let [type,num] = str.split('=')
			this.type = type
			this.num = num
			return this
		}
	IdPart.prototype.toString = function(){return this.type + "=" + this.num}

	function Txt(txt){
		this.txt = txt.join ? txt.join('') : txt
		}
	Txt.prototype.toString = function(){return JSON.stringify(this.txt)}
	Txt.prototype.toJSON = function(){return this.txt}
	Txt.prototype.toAst = function(){return ['Txt', this.txt]}

	function Attr(ref,val){
		this.ref = ref
		this.val = typeof val =='string' ? new Txt(val) : val
		}
	Attr.prototype.toAst = function(){return ['Attr', this.ref, this.val.toAst()]}

	function Obj(id,elems){
		this.id = new Id(id)
		let textFlattenedElems = []
		let flatten = []
		for(let el of elems){
			if(typeof el === 'string'){flatten.push(el)}
			else{
				if(flatten.length){
					textFlattenedElems.push(new Txt(flatten.join('')))
					flatten = []
				}
				textFlattenedElems.push(el)
				}
		}
		if(flatten.length){textFlattenedElems.push(new Txt(flatten.join('')))}
		this.elems = textFlattenedElems
		}
	Obj.prototype.toAst = function obj_toAst(){return ['Obj',this.id.toAst(),...this.elems.map(e=>e.toAst())]}
	Obj.prototype.toString = function(){
		return `
		## Data Map ##
		${"\n"+JSON.stringify(
			this.dataMap(),
			(k,v)=>(typeof v == "string" ? v.replace(/\s+/g,' ').trim() : v),
			4)}

		## AST ##
		${"\n"+stringifyAst(this.toAst())}
		`.replace(/\n\s+##/g,"\n\n##")
		}
	Obj.prototype.log = function Obj_log(){
		console.log(this.dataMap())
		}
	Obj.prototype.text = function stringFromElements(collapseWhitespace){
		let str=[]
		let attr={}
		let elems = this.elems
		str.push('[')
		str.push("I:"+this.id)
		for(let el of elems){
			if(el instanceof Txt){
				let txt = collapseWhitespace ? el.txt.replace(/\s+/g,' ') : el.txt
				txt = txt.replace(/\[/g,'◀️').replace(/\]/g,'▶️') //just for debugging sanity...
				str.push(txt)
				continue
				}
			if(el instanceof Attr){
				str.push('A['+el.ref+']')
				attr[el.ref] = 'TODO'
				continue
				}
			if(el instanceof Obj){
				str.push(el.text())
				}
			}
		str.push(']')
		return str.join(' ')
		}

	Obj.prototype.attr = function attrsFromElements(path){
		let elems = this.elems
		if(!elems){return {}}
		let aEls = elems.filter(e=>e instanceof Attr)
		let attr = {}
		for(let el of aEls){
			attr[el.ref] = el.val
			}
		return attr
		}
	Obj.prototype.dataTree = function Obj_dataTree(startPath){
		return "TODO"

		}
	Obj.prototype.dataMap = function Obj_dataMap(path){
		let map = {['']:[]} //Will contains all data at or below the current object, indexed by ref
		let sequence = map['']

		for(let elem of this.elems){
			let ref, obj
			if(elem instanceof Txt){
				sequence.push(elem) //TODO: Convert to a separate interface, like .toRefString()
			}
			if(elem instanceof Attr){
				if(elem.val instanceof Txt){
					sequence.push(elem.ref+'='+elem.val.toString()) //TODO: Convert to a separate interface, like .toRefString()
					}
				if(elem.val instanceof Obj){
					obj = elem.val
					sequence.push(elem.ref+'=['+obj.id+']') //TODO: Convert to a separate interface, like .toRefString()
					}
				}
			if(elem instanceof Obj){
				sequence.push('['+elem.id+']')
				obj = elem
				map[new Id(this.id).concat(elem.id)] =  {} //Relationship object
				//data[elem.id] = elem
				}
			if(obj){
				let submap = obj.dataMap()
				let entries = Object.entries(submap).sort((a,b)=> a[0]>b[0])
				for(let [key,val] of entries){
					if(key===''){continue}
					map[key] = val
					}
				map[obj.id] = {'':submap['']}
				}
			}
		return map
		}

	function stringifyAst(ast){
		let [type, ...rest] = ast
		let multiChild = rest.length > 1
		let wrapStart 	= multiChild ? '[' : ''
		let wrapEnd 	= multiChild ? ']' : ''
		let linebreak 	= multiChild ? '\n¦ ' : ''
		return (
			type.slice(0,2)
			+ wrapStart
			+ linebreak
			+ rest
				.map(child => Array.isArray(child) ? stringifyAst(child) : JSON.stringify(child))
				.map(str => str.replace(/\n/g,'\n¦ '))
				.join(linebreak)
			+ linebreak
			+ wrapEnd
			)
		}
	}


function functionBodies(glue, ...fns){ // <-- for better syntax highlighting & compilation errors, let's put stuff that's JS not in a string literal
	return glue.map( (str,i) => str + (fns[i]||'').toString().replace(/^[^{]*/,'').replace(/[^}]*$/, '') ).join('')
	}
function chJoin(ch){return ch.join('')}
