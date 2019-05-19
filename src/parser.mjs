// IF PROD?...
// import {parse} from '../dist/parser.mjs'
import peg from '../node_modules/pegjs/lib/peg.js'
import grammar from './parser/grammar.mjs'

const {parse} = peg.generate(grammar)

const parser ={
	parse
	}

export {parser, parse}
export default parser
