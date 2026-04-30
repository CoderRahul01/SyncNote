import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SOCIALKIT_API_KEY = os.getenv("SOCIALKIT_API_KEY")
SOCIALKIT_BASE_URL = "https://api.socialkit.dev/youtube/transcript"

async def get_youtube_transcript(video_url: str):
    """
    Extract transcript from YouTube using SocialKit API.
    """
    if not SOCIALKIT_API_KEY:
        raise ValueError("SOCIALKIT_API_KEY is not set")
    
    async with httpx.AsyncClient() as client:
        params = {
            "url": video_url,
            "access_key": SOCIALKIT_API_KEY
        }
        response = await client.get(SOCIALKIT_BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
