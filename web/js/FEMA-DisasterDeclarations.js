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
					data.DisasterDeclarationsSummaries.forEach(record => {
							const resolveData = {};
							resolveData.femaDeclarationString = record.femaDeclarationString
							resolveData.disasterNumber = record.disasterNumber
							resolveData.declarationType = record.declarationType
							resolveData.declarationDate = record.declarationDate
							resolveData.fyDeclared = record.fyDeclared
							resolveData.incidentType = record.incidentType
							resolveData.declarationTitle = record.declarationTitle
							resolveData.ihProgramDeclared = record.ihProgramDeclared
							resolveData.iaProgramDeclared = record.iaProgramDeclared
							resolveData.paProgramDeclared = record.paProgramDeclared
							resolveData.hmProgramDeclared = record.hmProgramDeclared
							resolveData.incidentBeginDate = record.incidentBeginDate
							resolveData.incidentEndDate = record.incidentEndDate
							resolveData.disasterCloseoutDate = record.disasterCloseoutDate
							resolveData.fipsStateCode = record.fipsStateCode
							resolveData.fipsCountyCode = record.fipsCountyCode
							resolveData.placeCode = record.placeCode
							resolveData.designatedArea = record.designatedArea
							resolveData.declarationRequestNumber = record.declarationRequestNumber
			
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
				id: 'femaDeclarationString',
				dataType: tableau.dataTypeEnum.string
			},
			{
				id: 'disasterNumber',
				dataType: tableau.dataTypeEnum.int,
			},			
			{
				id: 'state',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'declarationDate',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'fyDeclared',
				dataType: tableau.dataTypeEnum.int,
			},
			{
				id: 'incidentType',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'declarationTitle',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'ihProgramDeclared',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'iaProgramDeclared',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'paProgramDeclared',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'hmProgramDeclared',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'incidentBeginDate',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'incidentEndDate',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'disasterCloseoutDate',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'fipsStateCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'fipsCountyCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'placeCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'designatedArea',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'declarationRequestNumber',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'FEMA2',
			alias: 'DisasterDeclarations',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var totalRecords;
		var baseURL = '	https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries';
		
		// fetch(baseURL + '?$inlinecount=allpages&$top=1')
		// 	.then(response => response.json())
		// 	.then(data => totalRecords= data.metadata.count);
		
		Promise.all(
			[...Array(70).keys()].map(n => {
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
			tableau.connectionName = 'FEMA DisasterDeclarations';
			tableau.submit();
		});
	});
})();
