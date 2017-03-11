/*
 * Copyright (C) 2016, 2017 Stefano D'Angelo <zanga.mail@gmail.com>
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
	Marca.DOMElementText.toPlainText = function (indent, opt) {
		return (new Array(indent + 1)).join("  ") + this.text;
	};

	Marca.DOMElementHypertext.toPlainText = function (indent, opt) {
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
				    .toPlainText(notFirst ? 0 : indent, opt);
			if (i != 0 && !notFirst)
				string += "\n\n";
			string += s;
		}

		return (firstChildIsInline ? (new Array(indent + 1)).join("  ")
					   : "") + string;
	};

	Marca.DOMElementHypertextHeading.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.level; i++)
			string += "#";
		string += " ";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + string;
	};

	Marca.DOMElementHypertextParagraph.toPlainText = function (indent, opt)
	{
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + string;
	};

	Marca.DOMElementHypertextUnorderedList.toPlainText =
	function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++) {
			var s = this.children[i].toPlainText(indent + 1, opt)
				.replace(/  (?=[^ ])/, '* ');
			if (i != 0)
				string += "\n";
			string += s;
		}
		return string;
	};

	Marca.DOMElementHypertextOrderedList.toPlainText =
	function (indent, opt) {
		if (this.children.length == 0)
			return "";

		var string = "";
		var digits = Math.floor(Math.log(this.children.length)
					* Math.LOG10E) + 1;
		var spaces = (new Array(digits + 3)).join(" ");
		var indentString = (new Array(indent + 1)).join("  ");
		var spaces = indentString + (new Array(digits + 3)).join(" ");
		for (var i = 0; i < this.children.length; i++) {
			var item = (i + 1) + "";
			while (item.length < digits)
				item = " " + item;
			var s = indentString + item + ". "
				+ this.children[i].toPlainText(0, opt)
				  .replace(/^(?=[^\n])/gm, spaces)
				  .substring(spaces.length);
			if (i != 0)
				string += "\n";
			string += s;
		}
		return string;
	};

	Marca.DOMElementHypertextFigure.toPlainText = function (indent, opt) {
		var indentString = (new Array(indent + 1)).join("  ");
		var string = "Figure: " + this.src;
		if (this.alt)
			string += " (" + this.alt + ")";
		if (this.children.length != 0) {
			string += "\n" + indentString;
			for (var i = 0; i < this.children.length; i++)
				string += this.children[i].toPlainText(0, opt);
		}
		return indentString + string;
	};

	Marca.DOMElementHypertextBlockQuotation.toPlainText =
	function (indent, opt)
	{
		return Marca.DOMElementHypertext.toPlainText
			    .call(this, indent + 1, opt)
			    .replace(/  (?=[^ ])/, ' “') + '”';
	};

	Marca.DOMElementHypertextAnchor.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + string
		       + " (" + this.href + ")";
	};

	Marca.DOMElementHypertextImage.toPlainText = function (indent, opt) {
		var string = (new Array(indent + 1)).join("  ") + this.src;
		return this.alt ? string + " (" + this.alt + ")" : string;
	};

	Marca.DOMElementHypertextSpan.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + string;
	};

	Marca.DOMElementHypertextStrong.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "*" + string + "*";
	};

	Marca.DOMElementHypertextEmphasis.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "_" + string + "_";
	};

	Marca.DOMElementHypertextDeleted.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "-" + string + "-";
	};

	Marca.DOMElementHypertextSubscript.toPlainText = function (indent, opt)
	{
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "_{" + string + "}";
	};

	Marca.DOMElementHypertextSuperscript.toPlainText =
	function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "^{" + string + "}";
	};

	Marca.DOMElementHypertextCode.toPlainText = function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return (new Array(indent + 1)).join("  ") + "‘" + string + "’";
	};

	Marca.DOMElementHypertextPreformatted.toPlainText =
	function (indent, opt) {
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].toPlainText(0, opt);
		return string.replace(/^(?=[^\n])/gm,
				      (new Array(indent + 1)).join("  "));
	};

	Marca.DOMElementHypertextBlockPassthrough.toPlainText =
	function (indent, opt) {
		if (this.output != "plaintext")
			return "";
		var string = "";
		for (var i = 0; i < this.children.length; i++)
			string += this.children[i].text;
		return string.replace(/^(?=[^\n])/gm,
				      (new Array(indent + 1)).join("  "));
	};
};
