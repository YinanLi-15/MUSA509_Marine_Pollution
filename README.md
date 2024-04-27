# MUSA509_Marine_Pollution
**Team Members:** Yinan Li, Xiaofan Liu, Tiffany Luo, Trevor Kapuvari

This is the MUSA509 2024Spring Final Project, aiming for predicting marine pollution for Chennai.

## Introduction & Use Case
The Ocean Conservancy’s Urban Ocean program has been developing projects that mitigate marine pollution, assess waste management, and enable cities to address ocean plastics and resilience. These projects intend to deploy “zero-waste” pilot solutions in multiple cities where they have partnerships and have collected waste management information. Our objective is to develop a litter-accumulation assessment model that identifies effective zero-waste site locations for national and multinational use. This geospatial risk assessment model serves the purpose of predicting litter accumulation based on globally sourced data with a repeatable framework on an international scale. The results of the model evaluate which sections of a given area have the highest likelihood to produce and contain litter relative to its surroundings. For our case, the Urban Ocean program intends to dedicate “zero-waste” solutions in these areas for the most effective impact for each deployment.

The use case of this project is to develop a web-based dashboard with litter data metrics, demographic metrics, and a litter accumulation risk site-selection tool serving the 12 cities of the Resilient Cities Network in siting zero-waste pilots.

## Data To Use
### Litter count data:
- source: Marine Debris Tracker https://debristracker.org/data
- This dataset is manually collected and recorded by the Urban Ocean program and collaborating organizations as part of the effort of the “zero-waste” project. It includes world-wide litter records with downloadable format in csv.

### Key Indicator data:
- source: OSM
- To achieve our objective of predicting across various countries, we will rely on OpenStreetMap (OSM) data to ensure the accessibility of data and to include a wide array of factors representing socio-economic dynamics, geomorphology, and waste management considerations within our model. Key indicators include the quantity and spatial distribution of restaurants, water distribution infrastructure, waste management facilities, and patterns of land use.

### Population:
- source: Meta data for good https://dataforgood.facebook.com/dfg/tools/high-resolution-population-density-maps#accessdata
- This dataset consists of high resolution population density and demographics estimation across countries.

## Cloud Computing Components
### Data Wrangling
- Ingestion with Google Cloud Function Deployment
We will deploy Google Cloud Function to ingest the data to Google Cloud Platform, including: extracting data, preparing data and loading data.
- Data Pipeline Establishment
After deploying the functions, we will use the Workflow tool to establish a data pipeline connecting the built functions and create a Trigger to update the data in the pipeline on a monthly basis.

### Data Analysis
In this part, we will transfer the previous feature engineering and modeling part with R script to BigQuery.
#### Feature Engineering with BigQuery
- We’ll visualize a dependent variable reformatted for repeatable use in a statistical context that better represents its relation to litter. The examples are, restaurants, roads, retail proximity, and significant presence of restaurants. The aim of these variables is to act as proxies for litter cases, providing insight on where litter most likely accumulated or ends up. These variables, similarly to litter, are analyzed on a fishnet grid where the quantity is counted per cell. Each variable is then placed on a combined fishnet grid with the litter data, computed using a Chi-Squared test, and evaluated for association between the variables and litter.
- For each variable, we will create two transformed variables: Spatial Lag(knn) and Local Moran’s to train the model.
- We’ll identify the most important variables with their correlation with litter.

#### Modeling with BigQuery
- Target Variable & Independent Variable
Target Variable: Litter Accumulation Risk
Independent Variable: Restaurants, In-land Water Distribution, Waste Management, Reside\ntial, Road, Industrial, Retail, Population Density, City/Country, Night Time Light Emission
- Litter Risk Modeling
Model Approach: Random Forest, Decision Tree, Linear Regression, Quasi, Quasi-Poisson, Hierarchical Bayes Regression.
We’ll test the models in two cities: Chennai and Bangkok for their predictions of litter risk across 5 categories of intensity, and pick the most effective model.
Cross-validation


## Interactive Map Development
We will use JavaScript to build the web application, including the Leaflet package for mapping, and ApexCharts for data visualizations. Key components within the web are:
- An interactive map containing grid tiles and layer control
- Key metrics for decision-making on city scale
- Charts for showing litter type on city scale
- Features to switch between cities

