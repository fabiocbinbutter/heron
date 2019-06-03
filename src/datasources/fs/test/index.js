//const Fs = require('./index.js')
const parseFile = require('../parseFile.js')

!async function(){
	//const datasource = Fs({path:'test/*.txt'})
	console.log("Testing...")
	const dataset1 = await parseFile(__dirname,'note1.txt')
	console.log(dataset1)
	}()
