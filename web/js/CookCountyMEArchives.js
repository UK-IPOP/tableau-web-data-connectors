(function () {
	var myConnector = tableau.makeConnector();

	// This creates the Web Data Connector schema that
	// describes the information returned by hte WDC.
	myConnector.getSchema = function (schemaCallback) {
		var cols = [
			{
				id: 'casenumber',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'incident_date',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'death_date',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'age',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'gender',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'race',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'latino',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'primarycause',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'primarycause_linea',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'secondarycause',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'gunrelated',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'opioids',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'cold_related',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'heat_related',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'commissioner_district',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'incident_street',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'incident_city',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'incident_zip',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'longitude',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'latitude',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'residence_city',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'residence_zip',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'WDC',
			alias: 'CookCountyMEArchives',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		$.getJSON(
			'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$limit=60000',
			function (resp) {
				var tableData = [];

				for (var i = 0, len = resp.length; i < len; i++) {
					tableData.push({
						casenumber: resp[i].casenumber,
						incident_date: resp[i].incident_date,
						death_date: resp[i].death_date,
						age: resp[i].age,
						gender: resp[i].gender,
						race: resp[i].race,
						primarycause: resp[i].primarycause,
						primarycause_linea: resp[i].primarycause_linea,
						secondarycause: resp[i].secondarycause,
						gunrelated: resp[i].gunrelated,
						opioids: resp[i].opioids,
						latino: resp[i].latino,
						cold_related: resp[i].cold_related,
						heat_related: resp[i].heat_related,
						commissioner_district: resp[i].commissioner_district,
						incident_street: resp[i].incident_street,
						incident_city: resp[i].incident_city,
						incident_zip: resp[i].incident_zip,
						longitude: resp[i].longitude,
						latitude: resp[i].latitude,
						residence_city: resp[i].residence_city,
						residence_zip: resp[i].residence_zip,
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
			tableau.connectionName = 'Cook County';
			tableau.submit();
		});
	});
})();
