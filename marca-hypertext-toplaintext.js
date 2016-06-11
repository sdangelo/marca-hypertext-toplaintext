/*
 * Copyright (C) 2016 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function (Marca) {
	Marca.DOMElementText.toPlainText = function (indent) {
		return (new Array(indent + 1)).join("  ") + this.text;
	};

	Marca.DOMElementHypertext.toPlainText = function (indent) {
		var string = "";
		var prevInline, inline = true;
		var firstChildIsInline;
		for (var i = 0; i < this.children.length; i++) {
			child = this.children[i];
			prevInline = inline;
			inline = Marca.DOMElementHypertextInline
				      .isPrototypeOf(child)
				 || Marca.DOMElementText.isPrototypeOf(child);
			if (i == 0)
				firstChildIsInline = inline;
			var notFirst = inline && prevInline;
			var s = this.children[i]
				    .toPlainText(notFirst ? 0 : indent);
			if (i != 0 && !notFirst)
				string += "\n\n";
			string += s;
		}

		return (firstChildIsInline ? (new Array(indent + 1)).join("  ")
					   : "") + string;
	};

	Marca.DOMElementHypertextHeading.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.level; i++)
			string += "#";
		string += " ";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + string;
	};

	Marca.DOMElementHypertextParagraph.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + string;
	};

	Marca.DOMElementHypertextUnorderedList.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++) {
			var s = this.children[i].toPlainText(indent + 1)
				.replace(/  (?=[^ ])/, '* ');
			if (i != 0)
				string += "\n";
			string += s;
		}
		return string;
	};

	Marca.DOMElementHypertextOrderedList.toPlainText = function (indent) {
		if (this.children.length == 0)
			return "";

		var string = "";
		var digits = Math.floor(Math.log10(this.children.length)) + 1;
		var spaces = (new Array(digits + 3)).join(" ");
		var indentString = (new Array(indent + 1)).join("  ");
		var spaces = indentString + (new Array(digits + 3)).join(" ");
		for (var i = 0; i < this.children.length; i++) {
			var item = (i + 1) + "";
			while (item.length < digits)
				item = " " + item;
			var s = indentString + item + ". "
				+ this.children[i].toPlainText(0)
				  .replace(/^(?=[^\n])/gm, spaces)
				  .substring(spaces.length);
			if (i != 0)
				string += "\n";
			string += s;
		}
		return string;
	};

	Marca.DOMElementHypertextFigure.toPlainText = function (indent) {
		var indentString = (new Array(indent + 1)).join("  ");
		var string = "Figure: " + this.src;
		if (this.alt)
			string += " (" + this.alt + ")";
		if (this.children.length != 0) {
			string += "\n" + indentString;
			for (var i = 0; i < this.children.length; i++)
				string += this.children[i].toPlainText(0);
		}
		return indentString + string;
	};

	Marca.DOMElementHypertextBlockQuotation.toPlainText = function (indent)
	{
		return Marca.DOMElementHypertext.toPlainText
			    .call(this, indent + 1).replace(/  (?=[^ ])/, ' “')
		       + '”';
	};

	Marca.DOMElementHypertextAnchor.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + string
		       + " (" + this.href + ")";
	};

	Marca.DOMElementHypertextStrong.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "*" + string + "*";
	};

	Marca.DOMElementHypertextEmphasis.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "_" + string + "_";
	};

	Marca.DOMElementHypertextDeleted.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "-" + string + "-";
	};

	Marca.DOMElementHypertextSubscript.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "_{" + string + "}";
	};

	Marca.DOMElementHypertextSuperscript.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "^{" + string + "}";
	};

	Marca.DOMElementHypertextCode.toPlainText = function (indent) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0);
		return (new Array(indent + 1)).join("  ") + "‘" + string + "’";
	};

	Marca.DOMElementHypertextBlockPassthrough.toPlainText =
	function (indent) {
		return this.output == "plaintext"
		       ? this.children[0].text
			     .replace(/^(?=[^\n])/gm,
				      (new Array(indent + 1)).join("  "))
		       : "";
	};
};
