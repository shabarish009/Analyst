#!/usr/bin/env python3
"""
Minimal test to check import
"""

def test_basic_import():
    """Test basic Python functionality"""
    print("Testing basic Python...")
    assert 1 + 1 == 2
    print("Basic Python works!")

def test_enum_import():
    """Test enum import"""
    print("Testing enum import...")
    from enum import Enum
    
    class TestEnum(Enum):
        TEST = "test"
    
    print("Enum import works!")

def test_dataclass_import():
    """Test dataclass import"""
    print("Testing dataclass import...")
    from dataclasses import dataclass
    
    @dataclass
    class TestClass:
        value: str
    
    print("Dataclass import works!")

def test_hypothesis_import():
    """Test hypothesis deconstructor import"""
    print("Testing hypothesis deconstructor import...")
    try:
        from core.hypothesis_deconstructor import StatisticalMethod
        print("StatisticalMethod imported successfully!")
        
        from core.hypothesis_deconstructor import TestPlan
        print("TestPlan imported successfully!")
        
        from core.hypothesis_deconstructor import HypothesisDeconstructor
        print("HypothesisDeconstructor imported successfully!")
        
        return True
    except Exception as e:
        print(f"Import failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_basic_import()
    test_enum_import()
    test_dataclass_import()
    success = test_hypothesis_import()
    
    if success:
        print("ALL IMPORTS SUCCESSFUL!")
    else:
        print("IMPORT FAILED!")
