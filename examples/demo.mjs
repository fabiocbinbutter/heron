//import * as pere from 'https://cdn.jsdelivr.net/gh/sgentle/pere@master/pere.js'

import * as hyperapp from 'https://cdn.jsdelivr.net/gh/jorgebucaran/hyperapp@1.2.9/src/index.min.js'//'./node_modules/hyperapp/src/index.js'
import heron from '../index.mjs'

let maxCaretOffset = 6
let initHtml = `Some random intro text<br />Lorem ipsum dolor set<br /><br />A partially completed [opp that is not finished.<br/ ><br/>And one [fr=+ That is new]`
let act,editor
let model = {
	stringParts: [],
	data: {},
	context: {
		text:"",
		data:{},
		route:"",
		target:""
		},
	datatypes:{
		account:{id:"account",label:"Account",description:"A company that is a prospect, customer, or former customer",
			attributes:{
				name:{id:"name", label:"Name"},
				size:{id:"size", label:"Size", description:"Number of employees"}
				}
			},
		fr:{id:"fr", label:"Feature Request",description:"An instance of someone requesting a specific product feature",
			attributes:{
				feature:{id:"feature",label:"Feature",datatype:"feature",required:true, description:"The feature being requested"},
				account:{id:"account",label:"Account",datatype:"account"},
				contact:{id:"contact",label:"Contact"},

				foo:{id:"contact",label:"Foo"},
				bar:{id:"contact",label:"Bar"},
				baz:{id:"contact",label:"Baz"}
				}
			},
		feature:{id:"feature", label:"Feature", description:"A product feature",
			attributes:{
				status:{id:"status",label:"Status"}
				}
			},
		opp:{id:"opp", label:"Opportunity", description:"A business opportunity",
			attributes:{
				prob:{id:"prob",label:"Probability"},
				amt:{id:"amt",label:"Amount"},
				cd:{id:"cd",label:"Likely Close Date", datatype:"date"},
				}
			}
		}
	}

function view(){
	let [div,button,textarea] =
		'div,button,textarea'
		.split(',')
		.map(t => (o,a) => hyperapp.h(t,o,a))
	return (s,a) => {
		let datatype = s.datatypes[s.context.datatype] || {label:"Unknown Datatype: "+(s.context.datatype||'')}
		return div({class:"main"},[
			div({class:"row top wrap-editor"},[
				div({id:"editor", class:"editor",
					contenteditable: true,
					onkeydown: a.handleKeyDown,
					onclick: a.handleClick
					},[]),
				div({class:"context-bar"},[
					pick(s.context.route,{
						"inspect":div({class:"header"},"Inspect (TODO)"),
						"suggest":div({class:"header"},"Suggest (TODO)"),
						"search":viewSearchContext(s,a),
						"*":viewDefaultContext(s,a)
						})
					])
				]),
			div({class:"row"},[
				button({id:"export",onclick:a.export},"Export")
				]),
			div({class:"text-out"},s.context.text),
			div({class:"text-out"},JSON.stringify(s.context.data,null,2))
			])

		function pick(val,lookup){return lookup[val]||lookup['*']}
		function viewSearchContext(s,a){
			let datatype = s.datatypes[s.context.target]
				|| {label:`Unknown datatype: ${s.context.target}`}
			let attributes = datatype.attributes ||{}
			return div({},[
				div({class:"header"},datatype.label),
				div({class:"description"},datatype.description||""),
				div({class:"subheader"},"Attributes:"),
				div({class:"description"},Object.keys(attributes).length?"":"No suggested attributes"),
				...Object.entries(attributes).map(([aid,attr])=>
					contextAction("+",attr.label,attr.description,()=>a.insertAttr(aid))
					),
				div({class:"subheader"},"Similar Objects:"),
				div({class:"description"},true?"":"No matches found (TODO)")
				])
			}
		function viewDefaultContext(s,a){
			return div({},[
				div({class:"header"},"Insert new object..."),
				...Object.entries(s.datatypes).map(([dt,datatype])=>
					contextAction("+",datatype.label,`[${dt}: ... ]`,()=>a.insertObj(dt))
					)
				])
			}
		function contextAction(icon,label,description,action){
			return div({
				class:"row context-action",
				onclick:action
				},[
				div({class:"icon new"},icon),
				div({class:"body"},[
					div({class:"title"},label),
					div({class:"reminder"},description)
					])
				])
			}
		}
	}
let actions = {
	state: value => state => state,
	handleKeyDown: evt => async state => {
		if(evt.key==="Tab"){
			evt.preventDefault()
			console.log("Tab",evt)
			}
		if(evt.key===']'){
			console.log("]",evt)
			}
		await delay(0)
		act.updateContext()
		},
	handleClick: evt => async (state) => {
		await delay(0)
		act.updateContext()
		},
	insertObj: type => state => {
		console.warn("TODO - act.insert",type)
		},
	insertAttr: type => state => {
		console.warn("TODO - act.insert",type)
		},
	updateContext: () => state => {
		let content = heron.dom.getContent(editor, {selection: document.getSelection()})
		let parsed = heron.parse(content.text)
		let data = parsed.data
		let route, target
		if(content.isInObject){
			let [k,obj] = Object.entries(data)[0]
			if(obj.id){
				let [type,id] = obj.id.split("/").slice(-1)[0].split("=")
				if(id){ //There is already an ID, show some info about it
					route = "inspect"
					target = id
					}
				else { //There is a type but no id, help find references, show common attributes
					route = "search"
					target = type
					}
				}
			else  { // There is no type, suggest types
				route = "suggest"
				target = obj.text.split(/\s+/)[0]
				}
			}
		else { //Cursor outside of an object, show common types to insert
			route = "default"
			}
		return {context:{text:content.text,data,route,target}}
		},
	export: () => state => {
		console.log("!")
		let content = heron.dom.getContent(editor)
		let parsed = heron.parse(content.text)
		let data = parsed.data
		return {context:{text:content.text,data}}
		}
	}
document.addEventListener("DOMContentLoaded", ()=> {
	act = hyperapp.app(model, actions, view(), document.body)
	setTimeout(()=>{
		editor = document.getElementById("editor")
		editor.innerHTML = initHtml
		}, 0)
	})




function delay(ms){
	return new Promise((res,rej)=>{
		setTimeout(res,ms)
		})
	}
