(function () {
	var myConnector = tableau.makeConnector();

	// This creates the Web Data Connector schema that
	// describes the information returned by hte WDC.
	myConnector.getSchema = function (schemaCallback) {
		var cols = [
			{
				id: 'term',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'count',
				dataType: tableau.dataTypeEnum.int,
			},
		];

		var tableSchema = {
			id: 'OpenFDASample1',
			alias: 'OpenFDA Opioid Sample',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		$.getJSON(
			'https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20210224])+AND+opioids&count=patient.drug.openfda.pharm_class_epc.exact',
			function (resp) {
				var tableData = [];
				for (var i = 0, len = resp.length; i < len; i++) {
					tableData.push({
						term: resp.results[i].term,
						count: resp.results[i].count,
					});
				}

				table.appendRows(tableData);
				doneCallback();
			}
		);
	};

	// This is reqired to register the Web Data Connector.
	tableau.registerConnector(myConnector);

	// Once the document has loaded we will attached functionality
	// to the submitButton.
	$(document).ready(function () {
		$('#submitButton').click(function () {
			tableau.connectionName = 'OpenFDA Opioid Sample';
			tableau.submit();
		});
	});
})();
