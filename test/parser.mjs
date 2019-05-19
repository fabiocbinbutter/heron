import {parser} from '../src/parser.mjs'
//import default as $ from "assert"

!async function(){try{
	/**/{
		let noteId = '123'
		let note =`
			This note has some data [thought What is data?]
			`
		let expectedData = {
			}
		let parsed = parser.parse(note)
		console.log(parsed)
		//$.deepStrictEqual(parsed.data,expectedData)
		}

	}
catch(e){
	console.log(e)
	}}()
