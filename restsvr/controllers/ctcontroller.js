'use strict';

import { toHHMMSSNow } from "../util/dateformat.js";

// const mSharedArrBuffer = new SharedArrayBuffer(4);
// const mA4 = new Uint8Array(mSharedArrBuffer);
// mA4[0] = 2;	// 1 - Just use index 0. 2 - Client ID starts from 2

// XML
function getXmlData(req, res)
{
	let data = `<?xml version="1.0" encoding="UTF-8"?>`;
	data += `<products>`;

	for (let i = 0; i < 5; i++) {
		data += `<item>Product ${i}</item>`;
  	}

	let dttm = toHHMMSSNow();
	data += `<generated>${dttm}</generated>`;
  	data += `</products>`;

	res.header("Content-Type", "application/xml");
	res.status(200).send(data);
}

const _getXmlData = getXmlData;
export { _getXmlData as getXmlData };
