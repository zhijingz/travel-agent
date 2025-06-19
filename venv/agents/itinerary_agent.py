from agents.base_agent import BaseAgent
import requests
import os
import json

ALLOWED_COUNTRIES = [
    "UK", "Norway", "Croatia", "Italy", "Malta", "Spain", "Portugal",
    "Austria", "Belgium", "France", "Germany", "Liechtenstein", "Luxembourg",
    "Netherlands", "Monaco", "Switzerland"
]

def is_valid_destination(destination):
    return destination in ALLOWED_COUNTRIES

class ItineraryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ItineraryPlanner", 
            description="Creates detailed travel itineraries based on interests and budget",
            avatar="itinerary_planner.png"
        )

    def create_itinerary(self, destination, days, interests):
        prompt = f"""
        Create a {days}-day itinerary for {destination} focusing on {', '.join(interests)}:
        1. Morning/Afternoon/Evening activities each day
        2. Transportation options between locations
        3. Budget estimates per activity (USD)
        4. Local dining recommendations
        5. Contingency plans for bad weather
        Format with markdown tables and use 🗺️🍴⛱️ emojis.
        """
        return self.get_response(prompt)