var wshShell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");

var mDom = new ActiveXObject("MSXML2.DOMDocument.6.0");
mDom.async = false;
mDom.resolveExternals = false;

var vtOut = WScript.StdOut;
var mFdlr = null;
var mArrBN = [];
var mapRef = {};

var cmd = wshShell.Exec('cmd /c dir /b /s grid*.xml');
var cmdOut = cmd.StdOut;
while (!cmdOut.AtEndOfStream) {	
	var fn = cmdOut.ReadLine();
	assertUniqueParentFolder(fn);
	
	var	bn = fso.GetBaseName(fn);	
	mArrBN.push(bn);
	if (bn.indexOf('_') > 0 ) {	// e.g. '2_1'
		var colRefId = gridDescriptor(bn);
		mapRef[colRefId] = 0;	
	}
}

for (var i=0; i<mArrBN.length; i++) {
	var bn = mArrBN[i];
	var fn = mFdlr + '\\' + bn + '.xml';
	mDom.load(fn);
	if (mDom.parseError.errorCode !== 0) {
		QuitWithError('[DOM] ' + mDom.parseError.reason);
	}
	var nodeColumns = firstDirectChild(mDom.documentElement, 'columns');
	if (nodeColumns == null) {
		QuitOnError('No Columns Element', 1)
	}
	var colRefId = gridDescriptor(bn);		
	checkRef(nodeColumns, colRefId);
}
for (var key in mapRef) {
	if (mapRef[key] === 0)
		vtOut.WriteLine('Unused ' + key);		
}

//
function assertUniqueParentFolder(vFn) {
	var	fldr = fso.GetParentFolderName(vFn);
	if (mFdlr == null) {
		mFdlr = fldr;
	} else if (mFdlr !== fldr) {
		QuitOnError('Diff: ' + mFdlr + ' ~' + fldr, 1)
	}
}

function gridDescriptor(bn) {
	return bn.substr(4);	// skip 'grid';	
}

function checkRef(nodeColumns, colRefId)
{
	var nodeList = nodeColumns.childNodes;
	for (var i=0; i<nodeList.length; i++) {
		var nodeCol = nodeList.item(i);
		if (nodeCol.getAttribute('type') === 'Ref') {
			var myRefId = colRefId + '_C' + nodeCol.getAttribute('colnum');
			if (! (myRefId in mapRef) ) {
				QuitOnError('Undefined ' + myRefId, 1)
			}
			mapRef[myRefId] = 1;
		}		
	}
}

//
function firstDirectChild(vNode, vName)
{
	var nodeList = vNode.childNodes;
	for (var i=0; i<nodeList.length; i++) {
		var node = nodeList.item(i);
		if (node.nodeType === 1 && node.tagName === vName)
			return node		
	}
	return null;
}

//
function QuitOnError(vMsg, vCode)
{
	WScript.Echo(vMsg);
	WScript.Quit(vCode);
}
