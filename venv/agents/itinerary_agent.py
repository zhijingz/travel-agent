from agno.agent import Agent
from agno.team import Team
from agno.models.groq import Groq
#from agno.tools.duckduckgo import DuckDuckGoSearchTools
from agents.base_agent import BaseAgent
import os
import re

class ItineraryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ItineraryPlanner",
            description="Seasoned travel planner with decades of experience",            
            avatar="travel_avatar.png", 
        )

    def plan_trip(self, from_city, destination_city, interests, date_from, date_to):
        prompt = f"""
        Plan a complete trip from {from_city} to {destination_city}
        Traveler interests: {interests}
        Dates: {date_from} to {date_to}
        
        Craft complete travel itineraries including: 
                "- City introduction (1 paragraphs)\n"
                "- Daily schedule with time allocations\n"
                "- Restaurant recommendations\n"
                "- Transportation options\n"
                "- Estimated costs\n"
                "- Safety tips\n"
                "Format response in markdown."
        
        """
        
        return self.get_response(prompt)
