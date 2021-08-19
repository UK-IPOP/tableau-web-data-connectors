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
					data.HazardMitigationAssistance.forEach((record) => {
						const resolveData = {};
						resolveData.region = record.region;
						resolveData.stateNumberCode = record.stateNumberCode;
						resolveData.state = record.state;
						resolveData.countyCode = record.countyCode;
						resolveData.county = record.county;
						resolveData.programArea = record.programArea;
						resolveData.projectIdentifier = record.projectIdentifier;
						resolveData.projectType = record.projectType;
						resolveData.projectTitle = record.projectTitle;
						resolveData.projectCounties = record.projectCounties;
						resolveData.numberOfProperties = record.numberOfProperties;
						resolveData.numberOfFinalProperties = record.numberOfFinalProperties;
						resolveData.status = record.status;
						resolveData.subgrantee = record.subgrantee;
						resolveData.costSharePercentage = record.costSharePercentage;
						resolveData.projectAmount = record.projectAmount;
						resolveData.federalShareObligated = record.federalShareObligated;
						resolveData.programFy = record.programFy;
						resolveData.dateInitiallyApproved = record.dateInitiallyApproved;
						resolveData.dateApproved = record.dateApproved;
						resolveData.dateClosed = record.dateClosed;
						resolveData.granteeTribalIndicator = record.granteeTribalIndicator;
						resolveData.dateClosed = record.dateClosed;
						resolveData.disasterNumber = record.disasterNumber;
						resolveData.benefitCostRatio = record.benefitCostRatio;
						resolveData.netValueBenefits = record.netValueBenefits;
						resolveData.subgranteeTribalIndicator = record.subgranteeTribalIndicator;
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
				id: 'region',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'stateNumberCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'state',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'countyCode',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'county',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'programArea',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'projectIdentifier',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'projectType',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'projectTitle',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'projectCounties',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'numberOfProperties',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'numberOfRecords',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'numberOfFinalProperties',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'status',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'subgrantee',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'costSharePercentage',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'projectAmount',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'federalShareObligated',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'programFy',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'dateInitiallyApproved',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'dateApproved',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'dateClosed',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'disasterNumber',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'grantee',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'benefitCostRatio',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'netValueBenefits',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'granteeTribalIndicator',
				dataType: tableau.dataTypeEnum.bool,
			},
			{
				id: 'subgranteeTribalIndicator',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'FEMA6',
			alias: 'HazardMitigationAssistance',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var baseURL = 'https://www.fema.gov/api/open/v2/HazardMitigationAssistanceProjects';

		Promise.all(
			[...Array(35).keys()].map((n) => {
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
			tableau.connectionName = 'FEMA HazardMitigationAssistance';
			tableau.submit();
		});
	});
})();
