from typing import Any, Dict

class HypothesisDeconstructor:
    def plan(self, prompt: str) -> Dict[str, Any]:
        # Minimal deterministic planner that yields a SQL step
        # In a real system, we'd use an LLM and tools. Tests can mock/extend.
        return {
            "prompt": prompt,
            "steps": [
                {"type": "sql", "name": "row_count", "sql": "SELECT 1 AS one;"}
            ]
        }

