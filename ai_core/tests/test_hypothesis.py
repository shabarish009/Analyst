from fastapi.testclient import TestClient
from app.main import app

def test_plan_hypothesis():
    client = TestClient(app)
    r = client.post('/plan_hypothesis', json={"prompt": "Check health"})
    assert r.status_code == 200
    j = r.json()
    assert 'plan' in j
    assert isinstance(j['plan'], dict)
    assert j['plan']['steps'][0]['type'] == 'sql'

