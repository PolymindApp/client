export default class CSV {

	/**
	 * Convert and download a list in CSV file format.
	 */
	static download(csv, title) {

		return new Promise((resolve, reject) => {
			var fileName = title.replace(' ', '-') + '.csv';
			var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
			var link = document.createElement("a");
			link.href = uri;
			link.style = "visibility:hidden";
			link.download = fileName;

			document.body.appendChild(link);
			setTimeout(function() {
				link.click();
				document.body.removeChild(link);
				resolve();
			});
		});
	}

	/**
	 * Convert any list to CSV.
	 *
	 * @param obj: Array
	 *
	 * @return string (CSV)
	 */
	static toCSV(list) {

		var csv = '';

		if(list.length === 0) {
			return csv;
		}

		// Prepare headings
		var headings = [];
		var appendHeading = function(value, key) {

			// If the value object is an array and all items has the
			// same amount of entries for that specific key/path, we assume
			// it's hard-coded keys and we inject them in the headings.
			if(value instanceof Array) {
				var allSameLength = true;
				angular.forEach(list, function(item, itemKey) {
					if(!item[key]) {allSameLength = false;}
				});
				if(!allSameLength) {
					headings.push(key);
				}
				else {
					angular.forEach(value, function(value2, key2) {
						appendHeading(value2, key + '[' + key2 + ']');
					});
				}
			}
			else if(value instanceof Object) {
				angular.forEach(value, function(value2, key2) {
					appendHeading(value2, key + '.' + key2);
				});
			}
			else {
				headings.push(key);
			}
		};
		angular.forEach(list[0], function(value, key) {
			appendHeading(value, key);
		});
		csv += headings.join(',') + '\r\n';

		// Prepare lines
		var appendLine = function(item, path, line) {
			try {
				var value = eval('item.' + path);
				if(value instanceof Array) {
					line.push('"[' + value.join(', ') + ']"');
				}
				else {
					line.push(value);
				}
			}
			catch(e) {
				line.push(null);
			}
		};
		angular.forEach(list, function(item, itemKey) {

			var line = [];
			angular.forEach(headings, function(heading, hKey) {
				appendLine(item, heading, line);
			});

			csv += line.join(',') + '\r\n';
		});

		return csv;
	}
}
