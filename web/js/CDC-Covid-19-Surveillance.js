(function () {
	var myConnector = tableau.makeConnector();

	// Make a reusable function that returns a single Promise
	function fetchAPI(num, base_url) {
		return new Promise(function (resolve, reject) {
			const url = base_url + '?$offset=' + num;
			fetch(url)
				.then((resp) => resp.json())
				.then((data) => {
					var combinedData = [];
					data.forEach((record) => {
						const resolveData = {};
						resolveData.case_month = record.case_month;
						resolveData.res_state = record.res_state;
						resolveData.state_fips_code = record.state_fips_code;
						resolveData.res_county = record.res_county;
						resolveData.county_fips_code = record.county_fips_code;
						resolveData.age_group = record.age_group;
						resolveData.sex = record.sex;
						resolveData.race = record.race;
						resolveData.ethnicity = record.ethnicity;
						resolveData.case_onset_interval = record.case_onset_interval;
						resolveData.process = record.process;
						resolveData.exposure_yn = record.exposure_yn;
						resolveData.current_status = record.current_status;
						resolveData.symptom_status = record.symptom_status;
						resolveData.exposure_yn = record.exposure_yn;
						resolveData.hosp_yn = record.hosp_yn;
						resolveData.icu_yn = record.icu_yn;
						resolveData.death_yn = record.death_yn;
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
				id: 'case_month',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'res_state',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'res_county',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'county_fips_code',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'sex',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'race',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'ethnicity',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'case_onset_interval',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'process',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'exposure_yn',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'current_status',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'symptom_status',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'hosp_yn',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'icu_yn',
				dataType: tableau.dataTypeEnum.string,
			},
			{
				id: 'death_yn',
				dataType: tableau.dataTypeEnum.string,
			},
		];

		var tableSchema = {
			id: 'CDCCovidSurveillance',
			alias: 'CDC-Covid-Surveillance',
			columns: cols,
		};
		schemaCallback([tableSchema]);
	};

	// This function is called when data is required from the
	// Web Data Connector.
	myConnector.getData = function (table, doneCallback) {
		var baseURL = 'https://data.cdc.gov/resource/n8mc-b4w4.json';
		var newURL = '';

		myConnector.getData = function (table, doneCallback) {
			$.getJSON(
				'https://data.cdc.gov/resource/n8mc-b4w4.json?$limit=50000&$order=case_month%20DESC',
				function (resp) {
					var tableData = [];

					for (var i = 0, len = resp.length; i < len; i++) {
						tableData.push({
							case_month: resp[i].case_month,
							res_state: resp[i].res_state,
							state_fips_code: resp[i].state_fips_code,
							res_county: resp[i].res_county,
							county_fips_code: resp[i].county_fips_code,
							age_group: resp[i].age_group,
							sex: resp[i].sex,
							race: resp[i].race,
							ethnicity: resp[i].ethnicity,
							case_onset_interval: resp[i].case_onset_interval,
							process: resp[i].process,
							exposure_yn: resp[i].exposure_yn,
							current_status: resp[i].current_status,
							symptom_status: resp[i].symptom_status,
							exposure_yn: resp[i].exposure_yn,
							hosp_yn: resp[i].hosp_yn,
							icu_yn: resp[i].icu_yn,
							death_yn: resp[i].death_yn,
						});
					}
					table.appendRows(tableData);
					doneCallback();
				}
			);
		};
	};

	// This is required to register the Web Data Connector.
	tableau.registerConnector(myConnector);

	// Once the document has loaded we will attached functionality
	// to the submitButton.
	$(document).ready(function () {
		$('#submitButton').click(function () {
			tableau.connectionName = 'CDC-Covid-Surveillance';
			tableau.submit();
		});
	});
})();
