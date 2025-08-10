from typing import Any, Dict, Optional

# Attempt optional integration with a local-first LLM (e.g., GPT4All)
# If unavailable, fall back to a deterministic heuristic. Tests can mock this.
try:
    from gpt4all import GPT4All  # type: ignore
    _HAS_GPT4ALL = True
except Exception:
    _HAS_GPT4ALL = False


def _llm_generate(prompt: str, schema: Optional[Dict[str, Any]] = None) -> Optional[str]:
    if not _HAS_GPT4ALL:
        return None
    try:
        # Use a small default model name if present in the user environment
        model = GPT4All("ggml-model-gpt4all-falcon-q4_0.bin")
        sys_prompt = "You are a SQL generator. Given user intent and schema JSON, output only SQL."
        ctx = f"Schema: {schema}" if schema else ""
        out = model.generate(prompt=f"{sys_prompt}\n{ctx}\nUser: {prompt}\nSQL:", max_tokens=128, temp=0)
        return out.strip()
    except Exception:
        return None


def generate_sql(prompt: str, schema: Optional[Dict[str, Any]] = None) -> str:
    """Return SQL based on prompt and optional schema.
    If a local-first LLM is available, attempt to use it; otherwise use the heuristic.
    """
    # Try LLM first (best effort, optional)
    llm_out = _llm_generate(prompt, schema)
    if isinstance(llm_out, str) and llm_out:
        return llm_out

    # Heuristic fallback
    base = "SELECT * FROM tbl_placeholder;"
    if not prompt:
        return base
    p = prompt.lower()
    if "count" in p:
        return "SELECT COUNT(*) AS count FROM tbl_placeholder;"
    if schema and isinstance(schema, dict) and schema:
        # Use first available table
        first_tbl = next(iter(schema.keys()))
        return f"SELECT * FROM {first_tbl};"
    return base

