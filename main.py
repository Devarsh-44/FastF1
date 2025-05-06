from fastapi import FastAPI
import fastf1
import fastf1.plotting
import pandas as pd

app = FastAPI()

# Enable caching for better performance
fastf1.Cache.enable_cache('cache')


@app.get("/")
def home():
    return {"message": "Welcome to the F1 Race Data API!"}


@app.get("/lap-times/{year}/{round_number}")
def get_lap_times(year: int, round_number: int):
    """Fetches lap times for the given race"""
    session = fastf1.get_session(year, round_number, 'R')
    session.load()
    
    laps = session.laps[['Driver', 'LapNumber', 'LapTime', 'Compound', 'TyreLife', 'Stint']]
    laps['LapTime'] = laps['LapTime'].dt.total_seconds()  # Convert to seconds
    
    return laps.to_dict(orient="records")


@app.get("/fastest-lap/{year}/{round_number}")
def get_fastest_lap(year: int, round_number: int):
    """Returns the fastest lap of the race."""
    session = fastf1.get_session(year, round_number, 'R')
    session.load()
    
    fastest_lap = session.laps.pick_fastest()
    
    return {
        "Driver": fastest_lap['Driver'],
        "LapTime": fastest_lap['LapTime'].total_seconds(),
        "LapNumber": fastest_lap['LapNumber'],
        "TyreCompound": fastest_lap['Compound']
    }
