/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleIndices = { note: 0 },
      peg$startRuleIndex   = 0,

      peg$consts = [
        function(e) {return peek(new Obj('',e))},
        "\"...\"",
        peg$literalExpectation("\"...\"", false),
        function() {return [T.TEXT, "STR"]},
        "[",
        peg$literalExpectation("[", false),
        "]",
        peg$literalExpectation("]", false),
        function(id, rest) {
            let elems = unpair(rest)
            return new Obj(id, elems)
            },
        "/",
        peg$literalExpectation("/", false),
        function(head, rest) {return new Id(head + unpair(rest).join(''))},
        ":",
        peg$literalExpectation(":", false),
        function(type, id) {
            return type + (id ? id[0]+id[1] : '')
            },
        function(ref, val) {
        		return new Attr(ref,val)
        		},
        function(ch) {return new Txt(ch)},
        /^[^[\n\]:\/ \t]/,
        peg$classExpectation(["[", "\n", "]", ":", "/", " ", "\t"], true, false),
        "*",
        peg$literalExpectation("*", false),
        /^[0-9]/,
        peg$classExpectation([["0", "9"]], false, false),
        " ",
        peg$literalExpectation(" ", false),
        /^[\n\t ]/,
        peg$classExpectation(["\n", "\t", " "], false, false),
        /^[ \t]/,
        peg$classExpectation([" ", "\t"], false, false),
        "\n",
        peg$literalExpectation("\n", false),
        /^[^[\n\]]/,
        peg$classExpectation(["[", "\n", "]"], true, false),
        /^[^[\n\] \t]/,
        peg$classExpectation(["[", "\n", "]", " ", "\t"], true, false),
        "\\",
        peg$literalExpectation("\\", false),
        function(c) {return ch},
        /^[\/[\]:"]/,
        peg$classExpectation(["/", "[", "]", ":", "\""], false, false),
        "|",
        peg$literalExpectation("|", false),
        function() {return "\\"},
        "n",
        peg$literalExpectation("n", false),
        function() {return "\n"},
        "u",
        peg$literalExpectation("u", false),
        /^[0-9a-fA-F]/,
        peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false),
        function() {0,6},
        ";",
        peg$literalExpectation(";", false),
        function(ch) {return String.fromCodePoint(parseInt(ch,16));},
        function() {return new Txt("]")}
      ],

      peg$bytecode = [
        peg$decode("%$;!0#*;!&/' 8!: !! )"),
        peg$decode(";\".G &;#.A &;'.; &;..5 &;-./ &;,.) &;).# &;6"),
        peg$decode("%2!\"\"6!7\"/& 8!:#! )"),
        peg$decode("%2$\"\"6$7%/\x8B#;$.\" &\"/}$$%;-.\" &\"/,#;&/#$+\")(\"'#&'#0;*%;-.\" &\"/,#;&/#$+\")(\"'#&'#&/=$2&\"\"6&7'.\" &\"/)$8$:($\"\"!)($'#(#'#(\"'#&'#"),
        peg$decode("%;%/k#$%2)\"\"6)7*/,#;%/#$+\")(\"'#&'#0<*%2)\"\"6)7*/,#;%/#$+\")(\"'#&'#&/)$8\":+\"\"! )(\"'#&'#"),
        peg$decode("%;*/P#%2,\"\"6,7-/,#;+/#$+\")(\"'#&'#.\" &\"/)$8\":.\"\"! )(\"'#&'#"),
        peg$decode(";#.) &;'.# &;)"),
        peg$decode("%;*/M#2,\"\"6,7-/>$;#.) &;\".# &;(/)$8#:/#\"\" )(#'#(\"'#&'#"),
        peg$decode("%$;1.) &;/.# &;,/2#0/*;1.) &;/.# &;,&&&#/' 8!:0!! )"),
        peg$decode("%$;0/&#0#*;0&&&#/' 8!:0!! )"),
        peg$decode("%$41\"\"5!72/,#0)*41\"\"5!72&&&#/' 8!:0!! )"),
        peg$decode("%%23\"\"6374.\" &\"/?#$45\"\"5!760)*45\"\"5!76&/#$+\")(\"'#&'#/' 8!:0!! )"),
        peg$decode("%$27\"\"6778/,#0)*27\"\"6778&&&#/' 8!:0!! )"),
        peg$decode("%%49\"\"5!7:/?#$4;\"\"5!7<0)*4;\"\"5!7<&/#$+\")(\"'#&'#/' 8!:0!! )"),
        peg$decode("%%2=\"\"6=7>/E#$2=\"\"6=7>/,#0)*2=\"\"6=7>&&&#/#$+\")(\"'#&'#/' 8!:0!! )"),
        peg$decode("4?\"\"5!7@"),
        peg$decode("4A\"\"5!7B"),
        peg$decode("%2C\"\"6C7D/C#;2./ &;3.) &;4.# &;5/($8\":E\"! )(\"'#&'#"),
        peg$decode("4F\"\"5!7G"),
        peg$decode("%2H\"\"6H7I/& 8!:J! )"),
        peg$decode("%2K\"\"6K7L/& 8!:M! )"),
        peg$decode("%2N\"\"6N7O/Q#%4P\"\"5!7Q/& 8!:R! )/7$2S\"\"6S7T/($8#:U#!!)(#'#(\"'#&'#"),
        peg$decode("%2&\"\"6&7'/& 8!:V! )")
      ],

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleIndices)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleIndex = peg$startRuleIndices[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$decode(s) {
    var bc = new Array(s.length), i;

    for (i = 0; i < s.length; i++) {
      bc[i] = s.charCodeAt(i) - 32;
    }

    return bc;
  }

  function peg$parseRule(index) {
    var bc    = peg$bytecode[index],
        ip    = 0,
        ips   = [],
        end   = bc.length,
        ends  = [],
        stack = [],
        params, i;

    while (true) {
      while (ip < end) {
        switch (bc[ip]) {
          case 0:
            stack.push(peg$consts[bc[ip + 1]]);
            ip += 2;
            break;

          case 1:
            stack.push(void 0);
            ip++;
            break;

          case 2:
            stack.push(null);
            ip++;
            break;

          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;

          case 4:
            stack.push([]);
            ip++;
            break;

          case 5:
            stack.push(peg$currPos);
            ip++;
            break;

          case 6:
            stack.pop();
            ip++;
            break;

          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;

          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;

          case 9:
            stack.splice(-2, 1);
            ip++;
            break;

          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;

          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;

          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;

          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);

              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }

            break;

          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;

          case 22:
            stack.push(peg$consts[bc[ip + 1]]);
            peg$currPos += peg$consts[bc[ip + 1]].length;
            ip += 2;
            break;

          case 23:
            stack.push(peg$FAILED);
            if (peg$silentFails === 0) {
              peg$fail(peg$consts[bc[ip + 1]]);
            }
            ip += 2;
            break;

          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;

          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;

          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
            for (i = 0; i < bc[ip + 3]; i++) {
              params[i] = stack[stack.length - 1 - params[i]];
            }

            stack.splice(
              stack.length - bc[ip + 2],
              bc[ip + 2],
              peg$consts[bc[ip + 1]].apply(null, params)
            );

            ip += 4 + bc[ip + 3];
            break;

          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;

          case 28:
            peg$silentFails++;
            ip++;
            break;

          case 29:
            peg$silentFails--;
            ip++;
            break;

          default:
            throw new Error("Invalid opcode: " + bc[ip] + ".");
        }
      }

      if (ends.length > 0) {
        end = ends.pop();
        ip = ips.pop();
      } else {
        break;
      }
    }

    return stack[0];
  }

  	function peek(x){console.log(x);return x}
      function Txt(txt){
      	this.txt = txt.join ? txt.join('') : txt
      	}
      Txt.prototype.toString = function(){return this.txt}
      let gid = 1
      function Id(id){
      	id = id.join ? id.join('') : id
          if(!id){id="*"}
          if(id.includes('*')){
          	id = id.replace("*",gid++)
          	}
      	this.id = id
      	}
      Id.prototype.toString = function(){return this.id}

      function Attr(ref,val){
      	this.ref = ref
          this.val = val
      	}
      function Obj(id,elems){
      	if(id){this.id = ''+id}
          this.txt = stringFromElements(elems)
          this.attr = attrsFromElements(id,elems)
          let {rels,data} = dataFromElements(id,elems)
          this.rels = rels
          this.data = data
      	}

      function unpair(pairs){
      	return pairs.reduce((arr,[a,b])=>[
          	...arr,
              ...(a!==null ? [a] : [] ),
              ...(b!==null ? [b] : [] )
              ],[])
      	}
      function stringFromElements(elems){
  		let str=[]
          let attr={}
      	for(let el of elems){
  			if(el instanceof Txt){
              	str.push(el.txt)
                  continue
                  }
  			if(el instanceof Attr){
              	str.push('['+el.ref+']')
                  attr[el.ref] = 'TODO'
                  continue
  				}
              if(el instanceof Obj){
              	str.push('['+el.id+']')
              	}
              }
          return str.join('')
      	}
      function attrsFromElements(path,elems){
      	if(!elems){return {}}
          let aEls = elems.filter(e=>e instanceof Attr)
          let attr = {}
          for(let el of aEls){
          	attr[el.ref] = el.val
          	}
          return attr
      	}
      function dataFromElements(path,elems){
      	let rels = {}
          let data = {}
      	for(let el of elems){
          	let obj, path
              if(el instanceof Obj){
              	obj = el
                  path = el.id
                  }
              if(el instanceof Attr && el.val instanceof Obj){
              	obj = el.val
                  path = el.id.replace(/^\?|^$/,el.ref+"?")
              	}
              if(obj){
                  rels[path] = path
                  let {...shallow} = obj
                 	for(let [subId,subObj] of Object.entries(shallow.data)){
                      //for(let [loc,glb] of Object.entries(subObj.rels)){
                      //	subObj.rels[loc] = subId + '/' + glb
                     // 	}
                  	data[path+'/'+subId] = subObj
                  	}
                  delete shallow.data
                 	for(let [locl,glbl] of Object.entries(shallow.rels)){
                  	shallow.rels[locl] = path+'/'+glbl
                  	}
              	data[path] = shallow
              	}
          	}
          return {rels,data}
      	}


  peg$result = peg$parseRule(peg$startRuleIndex);

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

let parse = peg$parse
export default parse
