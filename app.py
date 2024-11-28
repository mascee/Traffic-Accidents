from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
import pandas as pd

# Flask app setup
app = Flask(__name__)

# SQLAlchemy database connection
DB_PATH = "data/traffic_accidents.sqlite"
engine = create_engine(f"sqlite:///{DB_PATH}")

#Mapping all states for converting full names to abbriviations.
#We need this so state names in both CSV files have the same column States
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
    return ("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accidents</title>
</head>
<body>
    <h1>Query Traffic Accidents</h1>
    <form action="/api/v1.0/accidents" method="get">
        <!-- Select for State -->
        <label for="state">Select State:</label>
        <select id="state" name="state">
""" + "".join(f'<option value="{key}">{value}</option>' for key, value in state_mapping.items()) + """
        </select>
        <br><br>

        <!-- Select for Limit -->
        <label for="limit">Select Limit:</label>
        <select id="limit" name="limit">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
        </select>
        <br><br>

        <!-- Submit Button -->
        <button type="submit">Submit</button>
    </form>
            
    <hr/>
            
    <a href='/api/v1.0/accidents'>/api/v1.0/accidents</a><br/>
    <a href='/api/v1.0/drivers'>/api/v1.0/drivers</a><br/>
    <a href='/api/v1.0/accidents_by_city'>/api/v1.0/accidents_by_city</a><br/r>
   

</body>
</html>
"""
    )

@app.route("/api/v1.0/accidents")
def accidents():
    state = request.args.get("state", default="CA")
    limit = request.args.get("limit", default="10")

    accidents_df = pd.read_sql(
        text("SELECT * FROM accidents WHERE state=:state LIMIT :limit"),
        engine,
        params={"state": state, "limit": limit})
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
        # Query for all cities
        query = text("""
            SELECT City, COUNT(*) as accident_count
            FROM accidents
            GROUP BY City
            ORDER BY accident_count DESC
        """)
        result = pd.read_sql(query, engine)

    # Convert the result to JSON
    return jsonify(result.to_dict(orient="records"))





# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)
