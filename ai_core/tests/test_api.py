import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_sql_returns_placeholder():
    resp = client.post("/generate_sql", json={"prompt": "list all rows"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["sql"].strip().lower().startswith("select")


def test_generate_sql_with_schema_picks_table():
    schema = {"customers": ["id", "name"]}
    resp = client.post("/generate_sql", json={"prompt": "anything", "schema": schema})
    assert resp.status_code == 200
    data = resp.json()
    assert "customers" in data["sql"].lower()

