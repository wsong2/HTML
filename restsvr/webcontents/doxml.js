function processXML(vXmlString)
{
	var parser = new DOMParser();
	var mRootName;
	var mNodesL1 = [];
	
	function addLines(vNode) {
		mNodesL1.push(vNode.nodeName);
		mNodesL1.push('T: ' + vNode.textContent);	
		vNode.getAttributeNames().forEach(n => {
			let val = vNode.getAttribute(n);
			mNodesL1.push('A: ' + n + ': ' + val);
		})
	}

	function processDOM(dom) {
		let eltDoc = dom.documentElement;
		mRootName = eltDoc.nodeName;

		let nodeList = eltDoc.childNodes;		
		for (let i=0; i<nodeList.length; i++) {
			let node = nodeList.item(i);		
			if (node.nodeType === 1)
				addLines(node);
		}
		return {
			rootName: mRootName, 
			dataRows: mNodesL1
		};
	}
	
	return (xmlString => {
		var xmlDoc = parser.parseFromString(xmlString, "text/xml");
		return processDOM(xmlDoc);
	})(vXmlString);
}

