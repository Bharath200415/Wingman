from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import base64
from google import genai
from pydantic import BaseModel
from analyzer import WhatsAppAnalyzer


app = FastAPI(title="WhatsApp Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_env_file(path: str = ".env"):
    if not os.path.exists(path):
        return

    with open(path, "r", encoding="utf-8") as fh:
        for raw_line in fh:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_env_file()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in backend .env")

client = genai.Client(api_key=GEMINI_KEY)
GEMINI_MODEL = "gemini-3.1-flash-lite-preview"



class ChatRequest(BaseModel):
    context: str
    question: str

CHART_LABELS = {
    "00_summary_stats.png": "Summary Stats",
    "01_response_time_percentiles.png": "Response Time Percentiles",
    "02_response_time_heatmap.png": "Response Time Heatmap",
    "03_message_volume.png": "Message Volume",
    "04_activity_patterns.png": "Activity Patterns",
    "05_conversation_initiators.png": "Conversation Initiators",
    "06_double_text_frequency.png": "Double Text Analysis",
    "07_message_length_analysis.png": "Message Length",
    "08_emoji_analysis.png": "Emoji Usage",
    "09_question_frequency.png": "Question Frequency",
    "10_conversation_gaps.png": "Conversation Gaps",
    "11_daily_streak.png": "Daily Streak",
}


def image_to_base64(path: str):
    with open(path, "rb") as f:
        return base64.b64encode(
            f.read()
        ).decode("utf-8")


@app.post("/analyze")
async def analyze_chat(file: UploadFile = File(...)):

    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=400,
            detail="Only .txt WhatsApp exports are supported."
        )

    # persistent outputs
    tmpdir = "analysis_outputs"
    os.makedirs(tmpdir, exist_ok=True)

    input_path = os.path.join(
        tmpdir,
        "chat.txt"
    )

    output_dir = os.path.join(
        tmpdir,
        "output"
    )

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    content = await file.read()

    with open(input_path, "wb") as f:
        f.write(content)

    try:
        analyzer = WhatsAppAnalyzer(
            input_path,
            output_dir
        )

        analyzer.parse_chat()

        stats = analyzer.generate_summary_stats()

        ai_context = analyzer.generate_ai_context()

        # generate plots
        analyzer.plot_response_time_percentiles()
        analyzer.plot_response_time_heatmap()
        analyzer.plot_message_volume()
        analyzer.plot_activity_patterns()
        analyzer.plot_conversation_initiators()
        analyzer.plot_double_text_frequency()
        analyzer.plot_message_length_analysis()
        analyzer.plot_emoji_analysis()
        analyzer.plot_question_frequency()
        analyzer.plot_conversation_gaps()
        analyzer.plot_daily_streak()

    except Exception as e:

        preview = []

        try:
            with open(
                input_path,
                "r",
                encoding="utf-8",
                errors="replace"
            ) as fh:

                for i, line in enumerate(fh):
                    if i >= 200:
                        break
                    preview.append(
                        line.rstrip("\n")
                    )

        except Exception:
            preview = [
                "<could not read preview>"
            ]

        return JSONResponse(
            status_code=422,
            content={
                "error": str(e),
                "preview_lines": preview,
                "hint":
                "If export format differs, re-export WhatsApp chat 'Without Media'."
            }
        )

    charts = []

    for filename, label in CHART_LABELS.items():

        path = os.path.join(
            output_dir,
            filename
        )

        if os.path.exists(path):
            charts.append({
                "id":
                filename.replace(
                    ".png",
                    ""
                ),

                "label":
                label,

                "image":
                image_to_base64(path)
            })

    return JSONResponse({
        "stats":
            {k: str(v) for k, v in stats.items()},

        "charts":
            charts,

        "participants":
            analyzer.df["sender"]
            .unique()
            .tolist(),

        "total_messages":
            len(analyzer.df),

        "sender_stats":
            ai_context["sender_stats"],

        "response_by_sender":
            ai_context["response_by_sender"],

        "peak_hours":
            ai_context["peak_hours"],

        "raw_messages":
            analyzer.get_raw_messages(),
    })

@app.post("/chat")
async def chat(req: ChatRequest):
    try:

        prompt = f"""
You are a sharp but concise WhatsApp relationship analyst.

Chat analytics:
{req.context}

User question:
{req.question}

Rules:
- Use the data.
- Be conversational.
- Give direct insights.
- Be concise.
"""

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return {
            "reply":
            response.text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



@app.get("/health")
def health():
    return {
        "status": "ok"
    }