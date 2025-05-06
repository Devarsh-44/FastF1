import fastf1 as f1
import sys
import json
import pandas as pd

# Ensure FastF1 cache is enabled
f1.Cache.enable_cache('cache')  

# Read input parameters from server.js
race_name = sys.argv[1] if len(sys.argv) > 1 else "Bahrain"
driver_filter = sys.argv[2] if len(sys.argv) > 2 else "all"
lap_filter = sys.argv[3] if len(sys.argv) > 3 else "all"

# List of all races (2021-2025 seasons)
seasons = range(2018, 2025)
all_races = []

for season in seasons:
    schedule = f1.get_event_schedule(season)
    all_races.extend(schedule['EventName'].tolist())

# Find the matching race
race_year = None
gp_round = None
for season in seasons:
    schedule = f1.get_event_schedule(season)
    race_match = schedule[schedule['EventName'].str.contains(race_name, case=False, na=False)]
    if not race_match.empty:
        race_year = season
        gp_round = int(race_match.iloc[0]['RoundNumber'])
        break

# If race not found, return an error
if race_year is None or gp_round is None:
    print(json.dumps({"error": "Race not found"}))
    sys.exit()

# Load the session
session = f1.get_session(race_year, gp_round, "R")  # "R" means race session
session.load()

# Get lap data
laps = session.laps
laps_df = laps[['Driver', 'LapNumber', 'LapTime']].dropna()

# Convert timedelta to seconds
laps_df['LapTime'] = laps_df['LapTime'].dt.total_seconds()

# Filter by driver
if driver_filter != "all":
    laps_df = laps_df[laps_df['Driver'] == driver_filter]

# Apply fastest/slowest lap filter
if lap_filter == "fastest":
    laps_df = laps_df[laps_df["LapTime"] == laps_df["LapTime"].min()]
elif lap_filter == "slowest":
    laps_df = laps_df[laps_df["LapTime"] == laps_df["LapTime"].max()]

# Convert to JSON
lap_data = laps_df.to_dict(orient="records")

# Get all drivers from the race
all_drivers = list(session.drivers)

# Output JSON
output = {
    "drivers": all_drivers,
    "races": all_races,
    "lap_times": lap_data
}

print(json.dumps(output))
sys.stdout.flush()
