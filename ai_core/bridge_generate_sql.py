import sys
import json
from app.main import app
from fastapi.testclient import TestClient

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "missing prompt"}))
        return 1
    prompt = sys.argv[1]
    schema = None
    if len(sys.argv) > 2 and sys.argv[2]:
        try:
            schema = json.loads(sys.argv[2])
        except Exception:
            schema = None
    client = TestClient(app)
    resp = client.post("/generate_sql", json={"prompt": prompt, "schema": schema})
    print(resp.text)
    return 0

if __name__ == "__main__":
    sys.exit(main())

