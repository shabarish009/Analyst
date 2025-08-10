"""Minimal test to verify pytest works"""

def test_basic():
    """Basic test that should always pass"""
    assert 1 + 1 == 2

def test_string():
    """Test string operations"""
    assert "hello" + " world" == "hello world"

def test_list():
    """Test list operations"""
    assert [1, 2, 3] == [1, 2, 3]
