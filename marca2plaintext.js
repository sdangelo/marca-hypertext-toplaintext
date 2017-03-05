#!/usr/bin/env node

if (process.argv.length != 4) {
	console.log("Usage: marca2plaintext infile outfile");
	process.exit(1);
}

var fs = require("fs");

var Marca = require("marca");
require("marca-hypertext")(Marca);
require("./marca-hypertext-toplaintext.js")(Marca);

var root = Marca.parse(fs.readFileSync(process.argv[2], "utf8"));
var dom = Object.create(Marca.DOMElementHypertextRoot);
dom.init(root, [Marca.CommonElementProtos, Marca.HypertextElementProtos]);

fs.writeFileSync(process.argv[3], dom.toPlainText(0));
