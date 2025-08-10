from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from statistics import mean
from oracle.llm import generate_sql as llm_generate_sql

app = FastAPI()

class GenerateSQLRequest(BaseModel):
    prompt: str
    schema: Optional[Dict[str, Any]] = None

class GenerateSQLResponse(BaseModel):
    sql: str

class AnalyzeDataRequest(BaseModel):
    name: str
    cols: List[str]
    sample: List[List[Any]]

class AnalyzeDataResponse(BaseModel):
    insights: str

class DashboardInsightsRequest(BaseModel):
    widgets: List[Dict[str, Any]]
    sources: Dict[str, Dict[str, Any]]

class DashboardInsightsResponse(BaseModel):
    insights: str

class HypothesisPlanRequest(BaseModel):
    prompt: str

class HypothesisPlanResponse(BaseModel):
    plan: Dict[str, Any]

@app.post("/generate_sql", response_model=GenerateSQLResponse)
def generate_sql(req: GenerateSQLRequest):
    sql = llm_generate_sql(req.prompt, req.schema)
    return {"sql": sql}

@app.post("/analyze_data", response_model=AnalyzeDataResponse)
def analyze_data(req: AnalyzeDataRequest):
    rows = req.sample
    n = len(rows)
    col_insights = []
    for i, c in enumerate(req.cols):
        col_vals = [r[i] for r in rows if i < len(r)]
        nums = []
        for v in col_vals:
            try:
                nums.append(float(v))
            except Exception:
                pass
        if nums:
            col_insights.append(f"{c}: count={len(nums)}, mean={mean(nums):.2f}")
        else:
            col_insights.append(f"{c}: non-numeric, distinct≈{len(set(map(str, col_vals)))}")
    summary = f"Rows={n}. " + "; ".join(col_insights)
    return {"insights": summary}

@app.post("/generate_dashboard_insights", response_model=DashboardInsightsResponse)
def generate_dashboard_insights(req: DashboardInsightsRequest):
    wcount = len(req.widgets)
    srcs = ", ".join(sorted(req.sources.keys()))
    desc = f"Dashboard with {wcount} widgets across sources: {srcs}."
    return {"insights": desc}

from oracle.hypothesis import HypothesisDeconstructor

@app.post("/plan_hypothesis", response_model=HypothesisPlanResponse)
def plan_hypothesis(req: HypothesisPlanRequest):
    plan = HypothesisDeconstructor().plan(req.prompt)
    return {"plan": plan}

