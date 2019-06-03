// IF WEB PROD?... import {parse} from '../dist/parser.mjs'
const peg = require('pegjs')
const grammar = require('./grammar.js')

const {parse} = peg.generate(grammar)

const parser ={
	parse
	}

exports = module.exports = parser
