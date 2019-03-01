import isDataNode from './dom-isDataNode.mjs'

const directions = {
	forward:  {isForward:1, incr:+1, child:"firstChild", sibling:"nextSibling",deeperBracket:"[",shallowerBracket:"]"},
	backward: {isBackward:1, incr:-1, child: "lastChild", sibling:"previousSibling",deeperBracket:"]",shallowerBracket:"["}
	}
const blockTags={"DIV":true,"P":true}

export default function getContext(container, selection, depth){
	let node = selection ? selection.focusNode : container
	let offset = selection && selection.focusOffset
	let contextStart = getContextBound(container, node, offset, 'backward', depth)
	let contextEnd = getContextBound(container, node, offset, 'forward', depth)
	let text = contextStart.stringParts.reverse().concat(contextEnd.stringParts).join('')
	return {
		text,
		isInObject: text[0]==='[',
		offset: contextStart.length
		}
	}

function ancestorAmong(rootNode, candidateNodes){
	let node = rootNode, C = candidateNodes.length
	while(node){
		for(let c=0;c<C;c++){
			if(node === candidateNodes[c]){
				return node
				}
			}
		node = node.parentNode
		}
	}
function min(a,b){return a<b?a:b}
function max(a,b){return a>b?a:b}

function getContextBound(container, initNode, offset, dir, depth = 1){
	let lastChar, lastNode, stringParts =[]
	let direction = directions[dir]
	let node = initNode
	if(isDataNode(node)){
		return {node, offset:null}
		}
	while(1){
		let text,cstart,cend,c,char
		if(isDataNode(node)){
			if(node === ancestorAmong(initNode,[node,container])){
				return {node, stringParts}
				}
			else {
				node = node[direction.sibling] || node.parentNode
				text = "[]"
				continue
				}
			}
		else if(node.nodeType === Node.TEXT_NODE){
			text = node.nodeValue
			}
		else if(node.tagName === "BR"){
			text = "\n"
			}
		else if(node.previousSibling === lastNode && (blockTags[node] || blockTags[lastNode]))	{
			text = "\n"
			}
		else {
			text=""
			}
		if(direction.isForward){
			cstart = node === initNode ? offset : 0
			cend = max(text.length,cstart)
			}
		else {
			cstart = node === initNode ? offset-1 : text.length-1
			cend = min(-1,cstart)
			}

		if(lastChar==="\n" && text[cstart]==="\n"){
			return {node,stringParts}
			}
		for(c=cstart; c!=cend; c+=direction.incr){
			char = text[c]
			if(char === direction.deeperBracket && text[c-1]!=='\\'){
				depth++
				}
			if( char === direction.shallowerBracket && text[c-1]!=='\\'){
				depth--
				}
			if(char==='\n' && text[c-1]==='\n'){
				depth=0
				}
			if(depth<1){
				stringParts.push(
					direction.isForward
					? text.slice(cstart,c+1)
					: text.slice(c,cstart+1)
					)
				return {node,stringParts}
				}
			}
		stringParts.push(
			direction.isForward
			? text.slice(cstart,cend)
			: text.slice(cend+1,cstart+1)
			)
		if(node === container || !node.parentNode){
			return {node,stringParts}
			}
		if(lastNode && node === lastNode.parentNode){
			lastNode = node
			node = node[direction.sibling] || node.parentNode
			}
		else {
			lastNode = node
			node = node[direction.child] || node[direction.sibling] || node.parentNode
			}
		lastChar = char || lastChar
		}
	}
