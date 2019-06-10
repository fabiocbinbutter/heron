// IF WEB PROD?... import {parse} from '../dist/parser.mjs'
const peg = require('pegjs')
const grammar = require('./grammar.js')

const parser = peg.generate(grammar)


exports = module.exports = {
	parse: function ({
			
		}={})

	}
