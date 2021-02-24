# Tableau Web Data Connectors

This repository consists of various web connectors for tableau. Each connector is an html file and a javascript file linked to an external API.

The landing page is available here: https://uk-ipop.github.io/tableau-web-data-connectors/ 

## Features:
- Promise based requests for asynchronous processing.
- Link external REST APIs to Tableau using Tableau WDC SDK.
- "Landing page" for routing to various connectors hosted on GitHub pages on the gh-pages branch.

## Connector Dataset Homepages:
- [FEMA Disaster Declarations](https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v1)
- [FEMA Housing Assistance Owners](https://www.fema.gov/openfema-data-page/housing-assistance-program-data-owners-v2)
- [FEMA Public Assisted Funded Projects](https://www.fema.gov/openfema-data-page/public-assistance-funded-projects-details)
- [FEMA Web Declaration Areas](https://www.fema.gov/openfema-data-page/fema-web-declaration-areas-v1)
- [Cook County ME Archives](https://datacatalog.cookcountyil.gov/Public-Safety/Medical-Examiner-Case-Archive/cjeq-bs86)
- [Open FDA Sample (direct link)](https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20210224])+AND+opioids&count=patient.drug.openfda.pharm_class_epc.exact)

## Steps to add a new connector:
1. Create new JS and HTML files by copying previous files and renaming.
2. In HTML file, rename title and the local JS link to the newly created JS file.
3. In JS file, fill out schema and specify fields in `fetchAPI()` function. 
4. In JS file, rename project in document ready function and table schema. 
5. In JS file, set `data` property/attribute in `fetchAPI()` to field in the api you are querying data for. 