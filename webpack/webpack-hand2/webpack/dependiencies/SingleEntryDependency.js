"use strict";
const ModuleDependency = require("./ModuleDependency");

class SingleEntryDependency extends ModuleDependency {
	/**
	 * @param {string} request request path for entry
	 */
	constructor(request) {
		super(request);
	}

	get type() {
		return "single entry";
	}
}

module.exports = SingleEntryDependency;
