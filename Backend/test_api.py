import os
import requests
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("RAPIDAPI_KEY")
host = os.getenv("RAPIDAPI_HOST")

headers = {
    "x-rapidapi-key": key,
    "x-rapidapi-host": host
}

endpoints = [
    # common irctc endpoints for trains between stations
    "https://indian-railway-irctc.p.rapidapi.com/api/v1/searchTrain?source=NDLS&destination=MAO&doj=2024-01-01",
    "https://indian-railway-irctc.p.rapidapi.com/api/v1/trainsBetweenStations?fromStationCode=NDLS&toStationCode=MAO&dateOfJourney=2024-01-01",
    "https://indian-railway-irctc.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=NDLS&toStationCode=MAO&dateOfJourney=2024-01-01",
    "https://indian-railway-irctc.p.rapidapi.com/api/v1/getTrainsBetweenStations",
    "https://indian-railway-irctc.p.rapidapi.com/api/v1/trainsBetweenStations",
    "https://indian-railway-irctc.p.rapidapi.com/api/v1/searchTrain?source=NDLS&destination=MAO",
    f"https://{host}/api/v1/searchTrain?source=NDLS&destination=MAO&doj=2024-01-01",
    f"https://{host}/api/v1/trainsBetweenStations?fromStationCode=NDLS&toStationCode=MAO&dateOfJourney=2024-01-01",
    f"https://{host}/api/v3/trainBetweenStations?fromStationCode=NDLS&toStationCode=MAO&dateOfJourney=2024-01-01",
    f"https://{host}/api/v1/searchTrain?source=NDLS&destination=MAO",
    f"https://{host}/api/v3/trainBetweenStations?fromStationCode=NDLS&toStationCode=MAO",
]

for url in endpoints:
    print(f"Trying {url}")
    try:
        res = requests.get(url, headers=headers, timeout=5)
        print(res.status_code)
        if res.status_code == 200:
            print(res.json())
            break
    except Exception as e:
        print("Error:", e)
