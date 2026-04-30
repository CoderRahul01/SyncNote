import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SUPADATA_API_KEY = os.getenv("SUPADATA_API_KEY")
SUPADATA_BASE_URL = "https://api.supadata.ai/v1/transcript"

async def get_instagram_transcript(reel_url: str):
    """
    Extract transcript from Instagram Reels using Supadata API.
    """
    if not SUPADATA_API_KEY:
        raise ValueError("SUPADATA_API_KEY is not set")
    
    headers = {
        "x-api-key": SUPADATA_API_KEY
    }
    params = {
        "url": reel_url,
        "mode": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(SUPADATA_BASE_URL, headers=headers, params=params)
        
        if response.status_code == 202:
            # Handle asynchronous job
            job_data = response.json()
            return await poll_supadata_job(job_data["jobId"])
            
        response.raise_for_status()
        return response.json()

async def poll_supadata_job(job_id: str):
    # This would need a polling loop in a real implementation
    # For now, we'll return the job info
    return {"status": "processing", "job_id": job_id}
