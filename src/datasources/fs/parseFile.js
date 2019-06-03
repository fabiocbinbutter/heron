const fs = require('fs')
const {promisify} = require("es6-promisify")
const readFile = promisify(fs.readFile.bind(fs))

const path = require('path')
const {parse} = require('../../parser/index.js')

module.exports = async function parseFile(
	basePath,
	relativePath,
	{
		encoding = 'utf8',
		extractor = undefined,
		} = {}
	){
	const noteId = relativePath //Is there a better identifier? Inode or something like that? Cross-platform concerns?
	const fullPath = path.resolve(basePath,relativePath)
	const fileContents = await readFile(fullPath,{encoding:'utf8'})
	const note = typeof extractor == 'function' ? extractor(fileContents) : fileContents
	const parsed = parse(note)
	return parsed
	}
