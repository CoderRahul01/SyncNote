import httpx
import os
from dotenv import load_dotenv

load_dotenv()

WAYIN_API_KEY = os.getenv("WAYIN_API_KEY")
WAYIN_BASE_URL = "https://api.wayin.ai/v2/transcripts"

async def get_linkedin_transcript(video_url: str):
    """
    Extract transcript from LinkedIn using WayinVideo API.
    """
    if not WAYIN_API_KEY:
        raise ValueError("WAYIN_API_KEY is not set")
    
    headers = {
        "Authorization": f"Bearer {WAYIN_API_KEY}"
    }
    
    async with httpx.AsyncClient() as client:
        # Submit task
        submit_response = await client.post(
            WAYIN_BASE_URL, 
            headers=headers,
            json={"url": video_url}
        )
        submit_response.raise_for_status()
        task_id = submit_response.json()["id"]
        
        # In a real app, you'd poll for the result
        return {"status": "submitted", "task_id": task_id}
