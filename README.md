# Traffic-Accidents
Team 8 Project 3. Traffic Accidents in US

# Traffic Accident Analysis and Visualization

## Project Overview
This project aims to analyze and visualize traffic accident patterns across the United States, focusing on factors such as weather, location, time, and severity. By identifying accident hotspots, trends, and risk factors, it aims to provide actionable insights for transportation planners, public safety officials, insurance companies, and the general public.

Our analysis explores correlations between environmental, temporal, and structural factors and accident occurrences, leveraging interactive visualizations to aid in decision-making and safety improvement strategies.

## Instructions for Use and Interaction
1. **Interactive Map:**
   - Explore accident hotspots across the U.S. using our Leaflet-powered interactive map.
   - Filter data by year and weather conditions using dropdown menus.
   - Click on Choropleth map to see the amount of driver per state

2. **Visualizations:**
   - Analyze trends through heatmaps and graph charts.

3. **Running the Project Locally:**
   - Install required dependencies: `npm install` for JavaScript or `pip install -r requirements.txt` for Python.
   - Start a local server (if applicable) to view the map and visualizations in a web browser.

## Ethical Considerations
This project ensures the responsible use of data by adhering to the following principles:
- **Privacy:** The dataset used does not include personally identifiable information.
- **Bias Mitigation:** We strive to minimize bias in our analysis by thoroughly preprocessing and cleaning the data.
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



