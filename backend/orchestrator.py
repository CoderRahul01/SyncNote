from backend.services.youtube import get_youtube_transcript
from backend.services.instagram import get_instagram_transcript
from backend.services.linkedin import get_linkedin_transcript
from backend.services.gemini import synthesize_transcript
from backend.services.memory import store_insight
import re

async def process_video_link(url: str, user_id: str):
    """
    Main orchestration flow for SyncNote.
    """
    # 1. Identification
    platform = identify_platform(url)
    
    # 2. Extraction
    try:
        if platform == "youtube":
            data = await get_youtube_transcript(url)
            transcript = data.get("transcript", "")
        elif platform == "instagram":
            data = await get_instagram_transcript(url)
            transcript = data.get("transcript", "")
        elif platform == "linkedin":
            data = await get_linkedin_transcript(url)
            transcript = data.get("transcript", "")
        else:
            raise ValueError(f"Unsupported platform for URL: {url}")
            
        if not transcript:
            raise ValueError("Could not extract transcript from video.")
            
        # 3. Synthesis
        report = await synthesize_transcript(transcript)
        
        # 4. Persistence
        await store_insight(user_id, report, url)
        
        return {
            "platform": platform,
            "report": report,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

def identify_platform(url: str) -> str:
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube"
    elif "instagram.com" in url:
        return "instagram"
    elif "linkedin.com" in url:
        return "linkedin"
    return "unknown"
