import sys
import json
from app.main import app
from fastapi.testclient import TestClient

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "missing payload"}))
        return 1
    payload = json.loads(sys.argv[1])
    client = TestClient(app)
    resp = client.post("/analyze_data", json=payload)
    print(resp.text)
    return 0

if __name__ == "__main__":
    sys.exit(main())

