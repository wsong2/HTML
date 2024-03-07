import { XMLParser } from 'fast-xml-parser';
import { readFileSync, existsSync } from "fs";

const mLoc = '../data/dfn';
const mSpace = '                                                  ';
const SP12 = '            ';

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    stopNodes: ["parse-me-as-string"]
};

const parser = new XMLParser(options);

var mViewList = [
    {
        level: 0,
        pfx: 'grid2',
    }
];

while (mViewList.length > 0) {
    let currState = mViewList.shift();

    let fn = mLoc + '/' + currState.pfx + '.xml';

    let fileContents = readFileSync(fn).toString();    
    let xmlObj = parser.parse(fileContents);
    let grid = xmlObj.grid;

    headerline(grid.columns.column, currState.level);

    let cols = grid.columns.column.map(function(currentelement, index, arrayobj) {
        return (currentelement.indexOf('(R)') >= 0) ? ('C' + (index+1)) : 'N';
      });
    let viewDetails = {pfx: currState.pfx, level: currState.level, cols: cols};
    let rowElt = grid.rows.row;
    if (rowElt instanceof Array) {
        rowElt.forEach(function(r, index) {
            viewDetails.rowIndex = index;
            rowLineAndChildren(r.cell, viewDetails, currState);
        });  
    } else {
        rowLineAndChildren(rowElt.cell, viewDetails, currState);
    }
}

function headerline(arr, level) {
    arr.forEach(function(part, index, theArray) {
        let str = part['#text'] + '(';
        let typ = part['@_type'];
        if (typ === 'Ref') {
            typ = 'R';
        }
        let txt = str + typ + ')';       
        theArray[index] = (txt + SP12).substring(0, 12);
    });   
    console.log(mSpace.substring(0, level*4) + arr.join(''));
}

function rowLineAndChildren(arr, viewDetails, currState) {
    arr.forEach(function(part, index, theArray) {
        let txt;
        if (viewDetails.cols[index] === 'N') {
            txt = part['#text'];
        } else {
            let colrow = viewDetails.cols[index]  + 'R' + (viewDetails.rowIndex+1);
            let pfx = viewDetails.pfx + '_' + colrow;
            let fn = mLoc + '/' + pfx + '.xml';
            if (!existsSync(fn)) {
                txt = part['#text'];
            } else {
                txt = colrow;
                let nextState = {
                    level: currState.level + 1,
                    pfx: currState.pfx + '_' + colrow
                }
                mViewList.push(nextState);
            }
        }
        theArray[index] = ((txt + SP12).substring(0, 12));
    });   
    console.log(mSpace.substring(0, viewDetails.level*4) + arr.join(''));
}