"""
Resume Analysis Backend (FastAPI) — Gemini (Google Gen AI) integration
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal
import os
import tempfile
import shutil
import json
import logging
import re
import traceback

# ... (Keep all extraction library imports and functions as they were) ...
# Optional extraction libraries
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import docx2txt
except ImportError:
    docx2txt = None

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

# Google GenAI SDK
try:
    import google.generativeai as genai
except ImportError:
    genai = None

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("resume-analyzer")

# Config
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCRCBs9LPg86NMTKjVnVB2XAgaiuRFmGiM")
GEMINI_MODEL = "gemini-1.5-flash"

app = FastAPI(title="Resume Analysis API with Gemini")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- NEW Pydantic Models for Dashboard ----------

class Scores(BaseModel):
    overall: float = Field(..., description="Overall score from 0-10.")
    ats_friendliness: int = Field(..., description="ATS score from 0-100.")
    layout_and_formatting: int = Field(..., description="Layout score from 0-100.")
    impact_and_quantification: int = Field(..., description="Score for using quantifiable results, 0-100.")

class KeywordAnalysis(BaseModel):
    top_technical_skills: List[str] = Field(default_factory=list)
    top_soft_skills: List[str] = Field(default_factory=list)
    keywords_by_section: Dict[str, List[str]] = Field(default_factory=dict)

class ActionVerbAnalysis(BaseModel):
    count: int
    unique_count: int
    usage_frequency: List[Dict[str, Any]] = Field(default_factory=list)

class LengthAnalysis(BaseModel):
    pages: int
    words: int
    sentiment: Literal["Too Short", "Ideal", "Too Long"]

class ReadabilityAnalysis(BaseModel):
    grade_level: str = Field(..., description="e.g., 'High School', 'College Graduate'")
    score_explanation: str = Field(..., description="Brief explanation of what the score means.")

class Analytics(BaseModel):
    action_verbs: ActionVerbAnalysis
    readability: ReadabilityAnalysis
    resume_length: LengthAnalysis

class CareerEvent(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_months: Optional[float] = None
    achievements: List[str] = Field(default_factory=list)

class ImprovementSuggestion(BaseModel):
    section: str
    suggestion: str
    severity: Literal["High", "Medium", "Low"]

class BeforeAfterExample(BaseModel):
    section: str
    original: str
    improved: str
    reason: str

class ResumeAnalysis(BaseModel):
    headline: str = Field(..., description="A short, encouraging headline for the user.")
    scores: Scores
    keywords: KeywordAnalysis
    analytics: Analytics
    career_timeline: List[CareerEvent] = Field(default_factory=list)
    improvement_suggestions: List[ImprovementSuggestion] = Field(default_factory=list)
    before_and_after_examples: List[BeforeAfterExample] = Field(default_factory=list)
    raw_llm: Optional[Dict[str, Any]] = None


# ---------- (Keep file extraction utilities as they are) ----------
# ... save_upload_to_temp, extract_text_from_pdf, etc. ...
def save_upload_to_temp(upload: UploadFile) -> str:
    try:
        suffix = os.path.splitext(upload.filename)[1] if upload.filename else ""
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(upload.file, tmp)
            tmp_path = tmp.name
        logger.debug(f"Saved upload to {tmp_path}")
        return tmp_path
    except Exception as e:
        logger.error(f"Failed to save upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

def extract_text_from_pdf(path: str) -> str:
    logger.debug(f"Extracting text from PDF: {path}")
    if not pdfplumber:
        logger.warning("pdfplumber is not installed, PDF extraction might fail.")
        return ""
    try:
        parts = []
        with pdfplumber.open(path) as pdf:
            for p in pdf.pages:
                text = p.extract_text(x_tolerance=1, y_tolerance=1) or ""
                parts.append(text)
        return "\n".join(parts)
    except Exception as e:
        logger.error(f"pdfplumber failed to extract text: {e}")
        return ""

def extract_text_from_docx(path: str) -> str:
    logger.debug(f"Extracting text from DOCX: {path}")
    if not docx2txt:
        logger.warning("docx2txt is not installed, DOCX extraction might fail.")
        return ""
    try:
        return docx2txt.process(path)
    except Exception as e:
        logger.error(f"docx2txt failed: {str(e)}")
        return ""

def extract_text_from_image(path: str) -> str:
    logger.debug(f"Extracting text from image: {path}")
    if not (pytesseract and Image):
        logger.warning("pytesseract or Pillow not installed, OCR will not work.")
        return ""
    try:
        img = Image.open(path)
        return pytesseract.image_to_string(img)
    except Exception as e:
        logger.error(f"pytesseract error: {str(e)}")
        return ""

def extract_text_generic(path: str, filename: Optional[str] = None) -> str:
    ext = (os.path.splitext(filename or path)[1] or "").lower()
    logger.debug(f"Extracting text from file: {path}, extension: {ext}")
    text = ""
    if ext == ".pdf":
        text = extract_text_from_pdf(path)
    elif ext in (".docx", ".doc"):
        text = extract_text_from_docx(path)
    elif ext == ".txt":
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            logger.warning(f"TXT read error: {str(e)}")
    elif ext in (".png", ".jpg", ".jpeg", ".tiff"):
        text = extract_text_from_image(path)
    
    if not text.strip() and ext != ".pdf": # Fallback for unknown extensions
        logger.debug("Attempting fallback PDF extraction for unknown file type.")
        text = extract_text_from_pdf(path)

    if not text.strip():
        logger.warning("All extraction methods failed")
    
    return text
    
# ---------- (Keep GeminiClient class as it is) ----------
class GeminiClient:
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model
        self.client = None
        if genai and self.api_key and self.api_key != "YOUR_API_KEY_HERE":
            try:
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel(
                    model_name=self.model,
                    safety_settings={
                        'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
                        'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
                        'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
                        'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
                    }
                )
                logger.debug("Initialized Gemini client")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {str(e)}")
        else:
            logger.warning("Gemini API key not configured. Client will be in mock mode.")

    async def generate(self, prompt: str, max_output_tokens: int = 2048) -> Dict[str, Any]:
        logger.debug(f"Generating with prompt length={len(prompt)}")
        if not self.client:
            logger.warning("Gemini client not available, returning mock response")
            # You can create a mock JSON response here that matches the new structure for testing
            return {"error": "mock_mode"}

        generation_config = {
            "response_mime_type": "application/json",
            "max_output_tokens": max_output_tokens,
            "temperature": 0.2,
        }

        try:
            logger.debug("Calling Gemini API")
            response = await self.client.generate_content_async(
                contents=[prompt],
                generation_config=generation_config,
            )
            text = response.text
            logger.debug(f"Gemini raw response: {text[:500]}...")
            
            try:
                json_match = re.search(r'```json\s*([\s\S]*?)\s*```', text, re.DOTALL)
                if json_match:
                    text = json_match.group(1)
                
                parsed = json.loads(text)
                return parsed
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from Gemini response: {e}")
                logger.error(f"Full response text: {text}")
                return {"raw_text_error": text}

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise HTTPException(status_code=502, detail=f"LLM service error: {str(e)}")

llm = GeminiClient(api_key=GEMINI_API_KEY, model=GEMINI_MODEL)

# ---------- NEW Prompt for Dashboard ----------

FULL_ANALYSIS_PROMPT = """
You are an expert resume analyzer AI. Your task is to analyze the given resume text and return a single, valid JSON object with a structure suitable for a data-driven dashboard. Adhere strictly to the schema below.

**JSON Schema:**
{{
  "headline": "A short, encouraging headline for the user (e.g., 'A strong foundation with room to shine!').",
  "scores": {{
    "overall": <float, 0.0-10.0, overall quality>,
    "ats_friendliness": <integer, 0-100, how well an ATS would parse it>,
    "layout_and_formatting": <integer, 0-100, visual appeal, consistency, and structure>,
    "impact_and_quantification": <integer, 0-100, use of metrics and strong results>
  }},
  "keywords": {{
    "top_technical_skills": [<string>, ... a list of the top 5 most prominent technical skills],
    "top_soft_skills": [<string>, ... a list of the top 3 most prominent soft skills],
    "keywords_by_section": {{
      "<section_name>": [<string>, ...],
      "<another_section>": [<string>, ...]
    }}
  }},
  "analytics": {{
    "action_verbs": {{
      "count": <integer, total number of action verbs>,
      "unique_count": <integer, number of unique action verbs>,
      "usage_frequency": [
        {{"verb": "<verb>", "count": <integer>}}, ...top 3 used verbs
      ]
    }},
    "readability": {{
      "grade_level": "<string, e.g., 'College Graduate'>",
      "score_explanation": "A brief, simple explanation of the readability. e.g., 'Your resume is clear, concise, and easy for recruiters to scan quickly.'"
    }},
    "resume_length": {{
      "pages": <integer, number of pages>,
      "words": <integer, total word count>,
      "sentiment": "<string, 'Too Short', 'Ideal', or 'Too Long'>"
    }}
  }},
  "career_timeline": [
    {{
      "company": "<string>",
      "role": "<string>",
      "start_date": "<string, YYYY-MM>",
      "end_date": "<string, YYYY-MM or 'Present'>",
      "duration_months": <integer or null>,
      "achievements": [<string>, ...]
    }}
  ],
  "improvement_suggestions": [
    {{
      "section": "<string, the relevant resume section>",
      "suggestion": "<string, a specific, actionable suggestion>",
      "severity": "<string, 'High', 'Medium', or 'Low'>"
    }}
  ],
  "before_and_after_examples": [
    {{
      "section": "<string>",
      "original": "<string, a direct quote from the resume>",
      "improved": "<string, an improved version of the quote>",
      "reason": "<string, why the new version is better>"
    }}
  ]
}}

**Input Resume:** {resume_text}
Return ONLY the JSON object. Do not add any commentary or markdown formatting. If a section from the resume is not present (e.g., no 'Projects' section), omit it from the `keywords_by_section` object. If no improvements are needed, return an empty list.
"""

# ---------- NEW Orchestration Logic ----------

async def run_full_analysis(resume_text: str, job_title: Optional[str] = None) -> ResumeAnalysis:
    logger.debug("Starting full analysis")
    # job_title is not used in the new prompt but kept for future use
    prompt = FULL_ANALYSIS_PROMPT.format(resume_text=resume_text)
    
    try:
        parsed_data = await llm.generate(prompt)

        if not parsed_data or "raw_text_error" in parsed_data or "scores" not in parsed_data:
            raise ValueError("LLM returned malformed or incomplete JSON data.")

        # Use Pydantic to parse and validate the entire structure at once
        analysis = ResumeAnalysis.parse_obj(parsed_data)
        analysis.raw_llm = {"raw_parsed": parsed_data} # Add raw response for debugging

        logger.debug("Analysis completed and validated successfully")
        return analysis

    except Exception as e:
        logger.error(f"Failed during analysis orchestration: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error creating analysis response: {str(e)}")


# ---------- (Keep API endpoints as they are) ----------
@app.post("/upload-resume", response_model=ResumeAnalysis)
async def upload_resume(file: UploadFile = File(...), job_title: Optional[str] = Form(None)):
    if file.size > 10 * 1024 * 1024:
        logger.error("File size exceeds 10MB")
        raise HTTPException(status_code=413, detail="File too large")
    
    logger.debug(f"Received file: {file.filename}, size: {file.size}")
    tmp_path = save_upload_to_temp(file)
    try:
        text = extract_text_generic(tmp_path, filename=file.filename)
        if not text or not text.strip():
            logger.error("No text extracted from file")
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the uploaded file. Ensure it is a valid PDF, DOCX, or TXT file.",
            )
        
        logger.debug(f"Extracted text length: {len(text)}")
        analysis = await run_full_analysis(text, job_title=job_title)
        return analysis
    
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Upload resume failed with an unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"An unexpected processing error occurred: {str(e)}")
    finally:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
                logger.debug(f"Cleaned up {tmp_path}")
        except Exception as e:
            logger.warning(f"Failed to clean up {tmp_path}: {str(e)}")

@app.post("/analyze-text", response_model=ResumeAnalysis)
async def analyze_text(resume_text: str = Form(...), job_title: Optional[str] = Form(None)):
    logger.debug(f"Received text length: {len(resume_text)}")
    if not resume_text.strip():
        logger.error("Empty resume text provided")
        raise HTTPException(status_code=400, detail="resume_text cannot be empty")
    
    try:
        analysis = await run_full_analysis(resume_text, job_title=job_title)
        return analysis
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Text analysis failed: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/health")
async def health():
    status = "ok"
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_API_KEY_HERE":
        status = "degraded (mock mode: API key missing)"
    elif not genai:
        status = "degraded (mock mode: SDK missing)"
    elif not llm.client:
        status = "degraded (mock mode: client failed to initialize)"
    
    logger.debug(f"Health check: {status}")
    return {"status": status}

# ---------- Run ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
