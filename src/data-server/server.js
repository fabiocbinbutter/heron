
const spirit = require("spirit").node
const {r,which,way} = require("spirit-guide")
const pfs = Promise.promisifyAll(require('fs'))

const app = which(
		way(r`/schema`,json,getSchema),

	)

//TODO listen

async function getSchema(){
	
	return
	}
