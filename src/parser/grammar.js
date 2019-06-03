
function grammarScript(){
	let gid = 1
	function Id(spec = ''){
		const parts =
			spec instanceof Id ? spec.parts
			: spec.split ? spec.split('/')
			: spec
		this.parts = parts.map(part => part instanceof IdPart ? part : new IdPart(part))
		console.log('Id',parts)
		return this
		}
	Id.prototype.toString = function(){return this.parts.join('/')}
	Id.prototype.toAst = function(){return ['Id', this.parts.map(p=>p.toString()).join('/')]}
	Id.prototype.concat = function(partsOrPart){
		let parts
			= partOrParts instanceof Id ? partOrParts.parts
			: Array.isArray(partsOrPart) ? partsOrPart
			: [partsOrPart]
		return new  Id([...this.id, ...parts])
		}

	function IdPart(str){
			str = str.includes('=') ? str : str+"=+"+(gid++)
			let [type,num] = str.split('=')
			console.log('IdPart',type,num)
			this.type = type
			this.num = num
			return this
		}
	IdPart.prototype.toString = function(){return this.type + "=" + this.num}

	function Txt(txt){
		this.txt = txt.join ? txt.join('') : txt
		}
	Txt.prototype.toString = function(){return JSON.stringify(this.txt)}
	Txt.prototype.toAst = function(){return ['Txt', this.txt]}

	function Attr(ref,val){
		this.ref = ref
		this.val = val
		}
	Attr.prototype.toAst = function(){return ['Attr', this.ref, this.val.toAst()]}

	function Obj(id,elems){
		this.id = new Id(id)
		this.elems = elems

		//this.txt = stringFromElements(elems)
		//this.attr = attrsFromElements(id,elems)
		//let {rels,data} = dataFromElements(id,elems)
		//this.rels = rels
		//this.data = data
		}
	Obj.prototype.toAst = function obj_toAst(){return ['Obj',this.id.toAst(),...this.elems.map(e=>e.toAst())]}
	Obj.prototype.toString = function(){
		return `${this.text(true)}

		## AST ##
		${"\n"+stringifyAst(this.toAst())}

		## Data Map ##
		${"\n"+JSON.stringify(this.dataMap(),undefined,2)}
		`.replace(/\n\s+##/g,"\n\n##")
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
	Obj.prototype.dataMap = function obj_dataMap(path){
		let elems = this.elems
		let data = {} //Contains all data at or below the current object, indexed by it's relative path
		for(let elem of elems){
			let localElemId, obj
			if(elem instanceof Obj){
				localElemId = elem.id
				obj = elem
				}
			if(elem instanceof Attr && elem.val instanceof Obj){
				localElemId = elem.id.concat("."+elem.ref) //or something...
				obj = elem.val
				}
			if(obj){
				let subdata = obj.dataMap()
			   	for(let [key,val] of Object.entries(subdata)){
					let subId = new Id(key)
					let compoundId = localElemId.concat(subId)
					data[compoundId] = val
				}
			   	// for(let [locl,glbl] of Object.entries(shallow.rels)){
				// 	shallow.rels[locl] = new Id([...elId,...glbl])
				// 	}
				//data[path] = shallow
				}
			}
		//return {rels,data}
		return data
		}


	function seconds(pairs){
		/* given [[0,1],[2,3],[4,5]], returns [1,2,3,4,5,6] */
		return pairs.reduce((arr,[a,b])=>[
			...arr,
			...[b]
			],[])
		}
	function stringifyAst(ast){
		let [type, ...rest] = ast
		let multiChild = rest.length > 1
		let wrapStart 	= multiChild ? '[' : ''
		let wrapEnd 	= multiChild ? ']' : ''
		let linebreak 	= multiChild ? '\n\t' : ''
		return (
			type.slice(0,1)
			+" "
			+ wrapStart
			+ linebreak
			+ rest
				.map(child => Array.isArray(child) ? stringifyAst(child) : JSON.stringify(child))
				.map(str => str.replace(/\n/g,'\n\t'))
				.join(linebreak)
			+ linebreak
			+ wrapEnd
			)
		}
	}


function functionBodies(glue, ...fns){ // <-- for better syntax highlighting & compilation errors, let's put stuff that's JS outside of the grammar
	return glue.map( (str,i) => str + (fns[i]||'').toString().replace(/^[^{]*/,'').replace(/[^}]*$/, '') ).join('')
	}
function chJoin(ch){return ch.join('')}

exports = module.exports = functionBodies`${grammarScript}

note = e:noteElement* ${ f=>{return new Obj(new Id(),e)} }

noteElement
	= quoted
	/ object
	/ attribute
	/ topLevelText

quoted = "\\"...\\"" ${ f=>{ return [T.TEXT, "STR"] } }

object =
	"["
	id:objectId?
	rest:(_obj_ objectElement)*
	"]"?
	${ f=>{
		let elems = seconds(rest)
		return new Obj(id, elems)
		}}

objectId =
	head:objectIdPart
	rest:objectIdRest*
	${f=>{
		return new Id([head, ...rest])
		}}

objectIdRest =
	"/" part:objectIdPart
	${f=>{
		return part
		}}

objectIdPart =
	type:typeString
	id:("=" idNumString)?
	${f=>{
		return new IdPart(type + (id||[]).join(''))
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
	${f=>{
		return new Txt(ch)
		}}

objectText =
	head:word
	rest:(_txt_ word)*
	${ f=>{return new Txt(rest.reduce((a,b)=>([...a,...b]),[head])) } }
	// ^ handle case where text ends with "\\n EOF"?


word = ch:(wordCharacter/escapedCharacter)+ ${chJoin}
typeString = ch:[^ \\n\\t[\\]=/]+ ${chJoin} //Anything but whitespace,brackets,=, or /
idNumString = ch:("+"? [0-9]*) ${chJoin}

_txt_
	= singleSpace
	/ lineContinuations
	/ nothing
_obj_
	= multiSpace
	/ lineContinuations
	/ singleBreak
	/ nothing

wordCharacter = [^ \\n\\t\\[\\]] // Anything but whitespace, opening bracket, or closing bracket
rootCharacter = [^[] //Anything but an opening bracket
singleSpace = " "
multiSpace = ch:[ \t]+ ${chJoin}
singleBreak = ch:( [\\t ]*   "\\n"   [\\t ]*) ${chJoin}
lineContinuations = ch:lineContinuation+ ${chJoin}
lineContinuation = ch:(" "? "\\n") [ \\t]+ "|" ${chJoin}
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

console.log(module.exports)
