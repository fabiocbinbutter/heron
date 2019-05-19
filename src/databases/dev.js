module.exports =
function Database(def){
	const data = {}
	return {
		commit,
		schema,
		search
		}

	async function commit(dataset){

		}
	async function search(needle){

		}
	async function schema(){
		const schemaClasses = /^_(class|attribute)/
		const schemaEntries = Object.entries(data)
			.filter(([k,v])=>k.match(schemaClasses))
		return Object.fromEntries(schemaEntries)
		}
	}
