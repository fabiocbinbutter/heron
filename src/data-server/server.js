
const spirit = require("spirit").node
const {r,which,way} = require("spirit-guide")
const pfs = Promise.promisifyAll(require('fs'))
const Datasource = require('./datasource')
const Database = require('./database')


const defaultConfig = {
	port: 6103,
	datasource: {
		type: "fs",
		path: "*.txt"
		},
	datasource: {
		type: "dev"
		}
	}




!async function(){
	const config = { ...defaultConfig, ...await fs.readFile('./config.json')}
	const datasource = Datasource(config.datasource)
	const database = Database(config.database)
	const app = defineWebApp(datasource)
	await new Promise( res => http.createServer(spirit.adapter(app)).listen(config.port,res))
	console.log(`http://localhost:${config.port}`)
	}()


//TODO listen

function defineWebApp(datasource){
	return which(
			way(r`/schema`,json,getSchema)
		)

	async function getSchema(){

		return
		}
	}

async function tryReadFile(path, dft){
	try { return await pfs.readFile(path) }
	catch(e){ return dft }
	}
