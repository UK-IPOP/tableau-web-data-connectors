(function () {
	var myConnector = tableau.makeConnector();

	// Make a reusable function that returns a single Promise
	function fetchAPI(num, base_url) {
		return new Promise(function (resolve, reject) {
			const url = base_url + '?$skip=' + num;
			fetch(url)
				.then((resp) => resp.json())
				.then((data) => {
					var combinedData = [];
					data.HousingAssistanceOwners.forEach((record) => {
						const resolveData = {};
						resolveData.disasterNumber = record.disasterNumber;
						resolveData.state = record.state;
						resolveData.county = record.county;
						resolveData.city = record.city;
						resolveData.zipCode = record.zipCode;
						resolveData.validRegistrations = record.validRegistrations;
						combinedData.push(resolveData);
					});
					resolve(combinedData);
				});
		});
	}

	// This creates the Web Data Connector schema that
	// describes the information returned by hte WDC.
	myConnector.getSchema = function (schemaCallback) {
		var cols = [
			{
				id: 'disasterNumber',
				dataType: tableau.dataTypeEnum.int,
			},
			{
				id: 'state',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'county',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'city',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'zipCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'validRegistrations',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'FEMA1',
			alias: 'HousingAssistanceOwners',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var baseURL = 'https://www.fema.gov/api/open/v2/HousingAssistanceOwners';

		Promise.all(
			[...Array(120).keys()].map((n) => {
				return fetchAPI(n * 1000, baseURL);
			})
		).then((data) => {
			var final = [];
			Object.keys(data).forEach((k) => {
				data[k].forEach((r) => {
					final.push(r);
				});
			});
			table.appendRows(final);
			doneCallback();
		});
	};

	// This is reqired to register the Web Data Connector.
	tableau.registerConnector(myConnector);

	// Once the document has loaded we will attached functionality
	// to the submitButton.
	$(document).ready(function () {
		$('#submitButton').click(function () {
			tableau.connectionName = 'FEMA HousingAssistanceOwners';
			tableau.submit();
		});
	});
})();
