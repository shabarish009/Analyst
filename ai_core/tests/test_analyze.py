from fastapi.testclient import TestClient
from app.main import app

def test_analyze_data_basic():
    client = TestClient(app)
    req = {"name": "ds", "cols": ["a","b"], "sample": [["1","2"],["3","x"]]}
    r = client.post("/analyze_data", json=req)
    assert r.status_code == 200
    j = r.json()
    assert "Rows=2" in j["insights"]
    assert "a:" in j["insights"]
    assert "b:" in j["insights"]

