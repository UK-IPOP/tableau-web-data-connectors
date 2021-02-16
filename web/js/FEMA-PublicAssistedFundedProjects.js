(function () {
	var myConnector = tableau.makeConnector();
	
	// Make a reusable function that returns a single Promise
	function fetchAPI(num, base_url) {
		return new Promise(function(resolve, reject) {
			const url = base_url + '?$skip=' + num;
			fetch(url)
				.then(resp => resp.json())
				.then((data) => {
					var combinedData = []
					data.PublicAssistanceFundedProjectsDetails.forEach(record => {
							const resolveData = {};
							resolveData.disasterNumber = record.disasterNumber
							resolveData.damageCategoryCode = record.damageCategoryCode
							resolveData.county = record.county
							resolveData.countyCode = record.countyCode
							combinedData.push(resolveData)
					});
					resolve(combinedData)
				})
		})
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
				id: 'damageCategoryCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'county',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'countyCode',
				dataType: tableau.dataTypeEnum.int,
			},
		];

		var tableSchema = {
			id: 'FEMA3',
			alias: 'PublicAssistanceFundedProjects',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var baseURL = '	https://www.fema.gov/api/open/v1/PublicAssistanceFundedProjectsDetails';
		
		Promise.all(
			[...Array(750).keys()].map(n => {
				return fetchAPI(n * 1000, baseURL)
			})).then(data => {
				var final = [];
				Object.keys(data).forEach(k => {
					data[k].forEach(r => {
						final.push(r)
					})
				})
				table.appendRows(final)
				doneCallback()
			})
	}

	// This is reqired to register the Web Data Connector.
	tableau.registerConnector(myConnector);

	// Once the document has loaded we will attached functionality
	// to the submitButton.
	$(document).ready(function () {
		$('#submitButton').click(function () {
			tableau.connectionName = 'FEMA PublicAssistanceFundedProjects';
			tableau.submit();
		});
	});
})();
