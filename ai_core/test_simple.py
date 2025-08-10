#!/usr/bin/env python3
"""
Simple test to verify the environment works
"""

def test_basic():
    """Basic test that should always pass"""
    assert 1 + 1 == 2
    print("Basic test passed")

def test_import():
    """Test importing our module"""
    try:
        from core.hypothesis_deconstructor import HypothesisDeconstructor
        print("Import successful")
        return True
    except Exception as e:
        print(f"Import failed: {e}")
        return False

if __name__ == "__main__":
    test_basic()
    test_import()
