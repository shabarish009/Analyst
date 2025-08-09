from fastapi.testclient import TestClient
from app.main import app

def test_generate_dashboard_insights():
    client = TestClient(app)
    widgets = [
        {"type": "bar", "dataSource": "ds1"},
        {"type": "kpi", "dataSource": "ds1"},
    ]
    resp = client.post("/generate_dashboard_insights", json={"widgets": widgets, "sources": {"ds1": {"cols": ["x","y"], "rows": [["A", 1], ["B", 2]]}}})
    assert resp.status_code == 200
    j = resp.json()
    assert "insights" in j and isinstance(j["insights"], str)
    assert "widgets" in j["insights"].lower()

