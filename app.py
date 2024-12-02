from flask import Flask, jsonify, request, render_template, send_from_directory
from sqlalchemy import create_engine, text
import pandas as pd
import os

# Flask app setup
app = Flask(__name__)

# SQLAlchemy database connection
DB_PATH = "data/traffic_accidents.sqlite"
engine = create_engine(f"sqlite:///{DB_PATH}")

# Mapping all states for converting full names to abbreviations.
# We need this so state names in both CSV files have the same column States
state_mapping = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
    'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee',
    'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
    'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
}

reverse_state_mapping = {
    value: key
    for key, value in state_mapping.items()
}

# Flask routes
@app.route("/")
def home():
    return render_template("home.html", state_mapping=state_mapping)

@app.route("/api/v1.0/accidents")
def accidents():
    state = request.args.get("state", default="CA")
    limit = request.args.get("limit", default="10")

    # Query the database for accidents based on the selected state and limit
    query = text("SELECT * FROM accidents WHERE state=:state LIMIT :limit")
    accidents_df = pd.read_sql(query, engine, params={"state": state, "limit": limit})

    # Return the results as JSON
    return jsonify(accidents_df.to_dict(orient="records"))

@app.route("/api/v1.0/drivers")
def drivers():
    drivers_df = pd.read_sql("SELECT * FROM licensed_drivers", engine)
    return jsonify(drivers_df.to_dict(orient="records"))

# Accidents grouped by city
@app.route("/api/v1.0/accidents_by_city")
def accidents_by_city():
    city = request.args.get("city")

    if city:
        # Query for a specific city
        query = text("""
            SELECT City, COUNT(*) as accident_count
            FROM accidents
            WHERE City = :city
            GROUP BY City
        """)
        result = pd.read_sql(query, engine, params={"city": city})
    else:
        # Query for all cities, ordered by accident count
        query = text("""
            SELECT City, COUNT(*) as accident_count
            FROM accidents
            GROUP BY City
            ORDER BY accident_count DESC
        """)
        result = pd.read_sql(query, engine)

    # Convert the result to JSON and return
    return jsonify(result.to_dict(orient="records"))

@app.route("/api/v1.0/accidents_by_state")
def accidents_by_state():
    state = request.args.get("state")

    if state:
        # Query for a specific state
        query = text("""
            SELECT state, COUNT(*) as accident_count
            FROM accidents
            WHERE state = :state
            GROUP BY state
        """)
        result = pd.read_sql(query, engine, params={"state": state})
    else:
        # Query for all states, ordered by accident count
        query = text("""
            SELECT state, COUNT(*) as accident_count
            FROM accidents
            GROUP BY state
            ORDER BY accident_count DESC
        """)
        result = pd.read_sql(query, engine)

    # Convert the result to JSON and return
    return jsonify(result.to_dict(orient="records"))

GRAPH_FOLDER = os.path.join(app.root_path, 'static/images')

# List all available graph filenames in the static/images directory
graph_files = ['day_night.png', 'hourly.png', 'daily.png', 'monthly.png', 'yearly.png', 
               'yearly_severity.png', 'weather_condition.png', 'weather_severity.png', 
               'humidity.png', 'temperature.png', 'visibility.png', 'infrastructure.png', 
               'state_percapita.png', 'state.png', 'city.png']

@app.route("/api/v1.0/graph")
def graph():
    # Render the template and pass the list of graph files and explanations
    return render_template('graphs.html', graph_files=graph_files)

# The URL to serve images should be '/graphs/<filename>'
@app.route('/graphs/<filename>')
def serve_graph(filename):
    # Serve the graph image from the static/images directory
    return send_from_directory(GRAPH_FOLDER, filename)

# Map route to render interactive map page
@app.route('/map')
def index():
    return render_template('index.html')

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
