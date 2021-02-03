(function () {
	var myConnector = tableau.makeConnector();
	function retrieveData(dataFeatures) {
		var td = [];
		for (var i = 0, len = dataFeatures.length; i < len; i++) {
			td.push({
				disasterNumber: dataFeatures[i].disasterNumber,
				region: dataFeatures[i].region,
				state: dataFeatures[i].state,
				county: dataFeatures[i].county,
				city: dataFeatures[i].city,
				zip: dataFeatures[i].zip,
				propertyAction: dataFeatures[i].propertyAction,
				structureType: dataFeatures[i].structureType,
				typeOfResidency: dataFeatures[i].typeOfResidency,
				actualAmountPaid: dataFeatures[i].actualAmountPaid,
				programFy: dataFeatures[i].programFy,
				status: dataFeatures[i].status,
				programArea: dataFeatures[i].programArea,
				title: dataFeatures[i].title,
				type: dataFeatures[i].type,
				numberOfProperties: dataFeatures[i].numberOfProperties,
				damageCategory: dataFeatures[i].damageCategory,
				granteeTribalIndicator: dataFeatures[i].granteeTribalIndicator,
				subgranteeTribalIndicator: dataFeatures[i].subgranteeTribalIndicator,
			});
		}
		return td;
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
				id: 'region',
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
				id: 'zip',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'propertyAction',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'structureType',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'typeOfResidency',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'actualAmountPaid',
				dataType: tableau.dataTypeEnum.int,
			},
			{
				id: 'programFy',
				dataType: tableau.dataTypeEnum.int,
			},
			{
				id: 'status',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'programArea',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'title',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'type',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'numberOfProperties',
				dataType: tableau.dataTypeEnum.int,
			},
			{
				id: 'damageCategory',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'granteeTribalIndicator',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'subgranteeTribalIndicator',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'FEMA1',
			alias: 'HazardMitigationProperties',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var baseURL = 'https://www.fema.gov/api/open/v2/HazardMitigationAssistanceMitigatedProperties';
		$.getJSON(baseURL + '?$inlinecount=allpages&$top=1', function(resp1) {
			var totalRecords = resp1.metadata.count;

			for (var i=0; i<totalRecords; i+=1000) {
				$.getJSON(baseURL + '?$skip=' + i, function(resp2) {
					var data = retrieveData(resp2.HazardMitigationAssistanceMitigatedProperties);
					table.appendRows(data);
				});
			}
		})
		doneCallback();
	}

	// This is reqired to register the Web Data Connector.
	tableau.registerConnector(myConnector);

	// Once the document has loaded we will attached functionality
	// to the submitButton.
	$(document).ready(function () {
		$('#submitButton').click(function () {
			tableau.connectionName = 'FEMA';
			tableau.submit();
		});
	});
})();
