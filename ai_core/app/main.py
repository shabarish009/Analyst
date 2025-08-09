from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any
from oracle.llm import generate_sql as llm_generate_sql

app = FastAPI()

class GenerateSQLRequest(BaseModel):
    prompt: str
    schema: Optional[Dict[str, Any]] = None

class GenerateSQLResponse(BaseModel):
    sql: str

@app.post("/generate_sql", response_model=GenerateSQLResponse)
def generate_sql(req: GenerateSQLRequest):
    sql = llm_generate_sql(req.prompt, req.schema)
    return {"sql": sql}

