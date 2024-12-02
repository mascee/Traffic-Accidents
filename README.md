# Traffic-Accidents
Team 8 Project 3. Traffic Accidents in US

# Traffic Accident Analysis and Visualization

## Project Overview
This project aims to analyze and visualize traffic accident patterns across the United States, focusing on factors such as weather, location, time, and severity. By identifying accident hotspots, trends, and risk factors, it aims to provide actionable insights for transportation planners, public safety officials, insurance companies, and the general public.

Our analysis explores correlations between environmental, temporal, and structural factors and accident occurrences, leveraging interactive visualizations to aid in decision-making and safety improvement strategies.

## Instructions for Use and Interaction
1. **Interactive Map:**
   - Explore accident hotspots across the U.S. using our Leaflet-powered interactive map. [https://mascee.github.io/Traffic-Accidents/](https://mascee.github.io/Traffic-Accidents/)
   - Filter data by year and weather conditions using dropdown menus.
   - Click on Choropleth map to see the amount of driver per state

2. **Visualizations:**
   - Analyze trends through heatmaps and graph charts.
   - All graphs are saved in the static/images folder. Graphs are made in the big_Traffic_Analysis.ipynb (uses original 3G data) and 1perc_Traffic_Analysis.ipynb (uses 1% data file). 
   - Visualization of graphs, as well as interactive map and JSON files are visible via app.py.
   - Some graphs are in traffic.ipynb. This file was used to experiment on data where we suspected data bias. It contains visibility graph that we did not use in our presentation.
  

3. **Running the Project Locally:**
   - Install required dependencies: `npm install` for JavaScript or `pip install -r requirements.txt` for Python.
   - Start a local server (if applicable) to view the map and visualizations in a web browser.
   - Interactive map can be run from VS code. Right click on index.html and open with Live Server
   - To run app.py in the command line type python app.py.

4. **Data cleaning.** 
   - The original data we used was from [ https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents]( https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents). The original csv file was 3Gb and too large to submit to Github. We put it to gitignore to avoid accidentally submitting it. We made a program downsample.py to downsample data to 1% so we can run the program and share data files. The data set was still large enough to use in data modeling.
   -  We deleted several columns we did not need and made 2 cleaned files: US_Accidents_March23_1_percent_cleaned.csv with NaN values deleted and One_Percent_Null_To_Zero.csv with NaN valuse converted to 0 to see what is best for data modeling. We converted date to datetime format and added Date and Year columns and made Accidents.csv to use in our programs. 
   -  clean_and_export.ipynb was used for data cleaning.
   -  Additionally we found data for registered drivers per state, grouped it by age, and and made Licenesed_drivers_By_State.csv to use in accidents per capita calculations.

## Ethical Considerations
This project ensures the responsible use of data by adhering to the following principles:
- **Privacy:** The dataset used does not include personally identifiable information.
- **Bias Mitigation:** We strive to minimize bias in our analysis by thoroughly preprocessing and cleaning the data. There were many interesting findings: Majority of accidents occured during perfect weather and clear sky. This is an example of data bias, as dataset disproportionately represents accidents that occur in clear weather. It could be for many different reasons - people drive more during good weather, more outdoor activities are during more favorable weather conditions. We had to disergard some findings where we found data bias.
- **Transparency:** All data sources and tools used in the project are openly disclosed.
- **Purpose:** The insights provided by this project aim to improve public safety and reduce traffic-related accidents.

## References
### Data Sources
- [US Accidents Dataset](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents/data?select=US_Accidents_March23.csv): Contains detailed information on traffic accidents across the United States.

### Tools and Libraries
- **JavaScript Libraries:**
  - [Leaflet.js](https://leafletjs.com/): For interactive mapping.
  - [D3.js](https://d3js.org/): For data visualization.
  - [Leaflet Choropleth Plugin](https://github.com/Leaflet/Leaflet.heat): For heatmaps and choropleth maps.
- **Python Libraries:**
  - Pandas, Matplotlib, Folium: For data processing and static visualizations.
- **Database:** PostgreSQL for storing and querying data.

### Code References
- Code snippets and plugins for Leaflet and Choropleth maps were adapted from [Leaflet documentation](https://leafletjs.com/) and related community resources.
- Preprocessing techniques inspired by Pandas documentation and examples.



