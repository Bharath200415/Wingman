from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import base64
from analyzer import WhatsAppAnalyzer

app = FastAPI(title="WhatsApp Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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


def image_to_base64(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


@app.post("/analyze")
async def analyze_chat(file: UploadFile = File(...)):
    
    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=400,
            detail="Only .txt WhatsApp exports are supported."
        )

    # OUTSIDE the if block
    tmpdir = "analysis_outputs"
    os.makedirs(tmpdir, exist_ok=True)

    input_path = os.path.join(tmpdir, "chat.txt")
    output_dir = os.path.join(tmpdir, "output")
    os.makedirs(output_dir, exist_ok=True)

    content = await file.read()

    with open(input_path, "wb") as f:
        f.write(content)

    try:
        analyzer = WhatsAppAnalyzer(input_path, output_dir)

        analyzer.parse_chat()
        stats = analyzer.generate_summary_stats()
        ai_context = analyzer.generate_ai_context()

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
        # read a small preview of the uploaded file for debugging (sanitized)
        preview = []
        try:
            with open(input_path, 'r', encoding='utf-8', errors='replace') as fh:
                for i, line in enumerate(fh):
                    if i >= 200:
                        break
                    preview.append(line.rstrip('\n'))
        except Exception:
            preview = ["<could not read preview>"]

        # return structured JSON with error message and a small preview to help identify format
        return JSONResponse(status_code=422, content={
            "error": str(e),
            "preview_lines": preview,
            "hint": "If timestamps look different from WhatsApp's typical exports, paste the first 20 lines here or re-export 'Without Media'."
        })

    charts = []

    for filename, label in CHART_LABELS.items():
        path = os.path.join(output_dir, filename)

        if os.path.exists(path):
            charts.append({
                "id": filename.replace(".png",""),
                "label": label,
                "image": image_to_base64(path)
            })

    return JSONResponse({
        "stats": {k:str(v) for k,v in stats.items()},
        "charts": charts,
        "participants": analyzer.df["sender"].unique().tolist(),
        "total_messages": len(analyzer.df),
        "sender_stats": ai_context["sender_stats"],
        "response_by_sender": ai_context["response_by_sender"],
        "peak_hours": ai_context["peak_hours"],
    })


@app.get("/health")
def health():
    return {"status": "ok"}