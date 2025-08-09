import sys
import json
from app.main import app
from fastapi.testclient import TestClient

def main():
    payload = sys.argv[1] if len(sys.argv) > 1 else None
    if not payload:
        print(json.dumps({"error": "missing prompt"}))
        return 1
    client = TestClient(app)
    resp = client.post("/plan_hypothesis", json={"prompt": payload})
    print(resp.text)
    return 0

if __name__ == "__main__":
    sys.exit(main())

