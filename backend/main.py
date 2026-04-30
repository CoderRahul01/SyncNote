from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.orchestrator import process_video_link

app = FastAPI(title="SyncNote API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportRequest(BaseModel):
    url: str
    user_id: str = "default_user"

@app.get("/")
async def root():
    return {"message": "SyncNote API is running"}

@app.post("/generate-report")
async def generate_report(request: ReportRequest):
    result = await process_video_link(request.url, request.user_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.get("/health")
async def health():
    return {"status": "healthy"}
