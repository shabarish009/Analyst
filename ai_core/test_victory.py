#!/usr/bin/env python3
"""
THE FINAL ASSAULT - Direct execution test for the Hypothesis Deconstructor

This bypasses pytest to execute tests directly and verify 100% functionality.
NO RETREAT. NO SURRENDER. ABSOLUTE VICTORY.
"""

import sys
import traceback
from typing import Dict, Any

def test_imports():
    """Test all critical imports"""
    print("=== TESTING IMPORTS ===")
    try:
        from core.hypothesis_deconstructor import (
            HypothesisDeconstructor,
            TestPlan,
            DeconstructionResponse,
            StatisticalMethod
        )
        print("✅ All imports successful")
        return True, (HypothesisDeconstructor, TestPlan, DeconstructionResponse, StatisticalMethod)
    except Exception as e:
        print(f"❌ Import failed: {e}")
        traceback.print_exc()
        return False, None

def test_initialization(HypothesisDeconstructor):
    """Test HypothesisDeconstructor initialization"""
    print("=== TESTING INITIALIZATION ===")
    try:
        deconstructor = HypothesisDeconstructor()
        assert deconstructor.model_name == "microsoft/DialoGPT-medium"
        assert not deconstructor.initialized
        assert deconstructor.hypothesis_patterns is not None
        assert len(deconstructor.hypothesis_patterns) > 0
        print("✅ Initialization test passed")
        return True, deconstructor
    except Exception as e:
        print(f"❌ Initialization test failed: {e}")
        traceback.print_exc()
        return False, None

def test_pattern_identification(deconstructor):
    """Test pattern identification"""
    print("=== TESTING PATTERN IDENTIFICATION ===")
    try:
        # Test comparison pattern
        pattern = deconstructor._identify_pattern("Revenue is higher than expected")
        assert pattern == "comparison"
        print("✅ Comparison pattern identified")
        
        # Test correlation pattern
        pattern = deconstructor._identify_pattern("Customer satisfaction correlates with revenue")
        assert pattern == "correlation"
        print("✅ Correlation pattern identified")
        
        # Test trend pattern
        pattern = deconstructor._identify_pattern("Revenue is increasing over time")
        assert pattern == "trend"
        print("✅ Trend pattern identified")
        
        # Test general pattern
        pattern = deconstructor._identify_pattern("Some random business question")
        assert pattern == "general"
        print("✅ General pattern identified")
        
        print("✅ All pattern identification tests passed")
        return True
    except Exception as e:
        print(f"❌ Pattern identification test failed: {e}")
        traceback.print_exc()
        return False

def test_entity_extraction(deconstructor):
    """Test entity extraction"""
    print("=== TESTING ENTITY EXTRACTION ===")
    try:
        hypothesis = "Customers from California have higher revenue"
        entities = deconstructor._extract_entities(hypothesis)
        
        assert "revenue" in entities["metrics"]
        assert "customer" in entities["dimensions"]
        assert "sales_data" in entities["data_sources"]
        assert "customer_data" in entities["data_sources"]
        
        print("✅ Entity extraction test passed")
        return True
    except Exception as e:
        print(f"❌ Entity extraction test failed: {e}")
        traceback.print_exc()
        return False

def test_sql_generation(deconstructor):
    """Test SQL query generation"""
    print("=== TESTING SQL GENERATION ===")
    try:
        entities = {
            "metrics": ["revenue"],
            "dimensions": ["customer", "state"],
            "comparisons": ["geographic"],
            "data_sources": ["customer_data", "sales_data"]
        }
        
        queries = deconstructor._generate_sql_queries(entities, "comparison")
        
        assert len(queries) > 0
        assert queries[0]["name"] == "comparison_analysis"
        assert "SELECT" in queries[0]["sql"].upper()
        
        print("✅ SQL generation test passed")
        return True
    except Exception as e:
        print(f"❌ SQL generation test failed: {e}")
        traceback.print_exc()
        return False

def test_statistical_methods(deconstructor, StatisticalMethod):
    """Test statistical method determination"""
    print("=== TESTING STATISTICAL METHODS ===")
    try:
        methods = deconstructor._determine_statistical_methods("comparison")
        assert StatisticalMethod.T_TEST in methods
        assert StatisticalMethod.DESCRIPTIVE in methods
        
        methods = deconstructor._determine_statistical_methods("correlation")
        assert StatisticalMethod.CORRELATION in methods
        assert StatisticalMethod.REGRESSION in methods
        
        print("✅ Statistical methods test passed")
        return True
    except Exception as e:
        print(f"❌ Statistical methods test failed: {e}")
        traceback.print_exc()
        return False

def test_hypothesis_deconstruction(deconstructor):
    """Test complete hypothesis deconstruction"""
    print("=== TESTING HYPOTHESIS DECONSTRUCTION ===")
    try:
        # Test empty hypothesis
        response = deconstructor.deconstruct_hypothesis("")
        assert not response.success
        assert response.error == "EMPTY_HYPOTHESIS"
        print("✅ Empty hypothesis test passed")
        
        # Test valid hypothesis
        hypothesis = "Customers from California are more profitable than customers from New York"
        response = deconstructor.deconstruct_hypothesis(hypothesis)
        
        assert response.success
        assert response.test_plan is not None
        assert response.test_plan.hypothesis == hypothesis
        assert len(response.test_plan.sql_queries) > 0
        assert len(response.test_plan.statistical_methods) > 0
        assert response.confidence > 0
        
        print("✅ Valid hypothesis test passed")
        return True
    except Exception as e:
        print(f"❌ Hypothesis deconstruction test failed: {e}")
        traceback.print_exc()
        return False

def test_async_initialization(deconstructor):
    """Test async model initialization"""
    print("=== TESTING ASYNC INITIALIZATION ===")
    try:
        import asyncio
        
        async def run_test():
            result = await deconstructor.initialize_model()
            assert result is True
            assert deconstructor.initialized is True
            return True
        
        result = asyncio.run(run_test())
        print("✅ Async initialization test passed")
        return result
    except Exception as e:
        print(f"❌ Async initialization test failed: {e}")
        traceback.print_exc()
        return False

def main():
    """Execute all tests and report results"""
    print("🔥 THE FINAL ASSAULT BEGINS 🔥")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 8
    
    # Test 1: Imports
    success, imports = test_imports()
    if success:
        tests_passed += 1
        HypothesisDeconstructor, TestPlan, DeconstructionResponse, StatisticalMethod = imports
    else:
        print("💀 CRITICAL FAILURE: Cannot proceed without imports")
        return False
    
    # Test 2: Initialization
    success, deconstructor = test_initialization(HypothesisDeconstructor)
    if success:
        tests_passed += 1
    else:
        print("💀 CRITICAL FAILURE: Cannot proceed without initialization")
        return False
    
    # Test 3: Pattern Identification
    if test_pattern_identification(deconstructor):
        tests_passed += 1
    
    # Test 4: Entity Extraction
    if test_entity_extraction(deconstructor):
        tests_passed += 1
    
    # Test 5: SQL Generation
    if test_sql_generation(deconstructor):
        tests_passed += 1
    
    # Test 6: Statistical Methods
    if test_statistical_methods(deconstructor, StatisticalMethod):
        tests_passed += 1
    
    # Test 7: Hypothesis Deconstruction
    if test_hypothesis_deconstruction(deconstructor):
        tests_passed += 1
    
    # Test 8: Async Initialization
    if test_async_initialization(deconstructor):
        tests_passed += 1
    
    print("=" * 50)
    print(f"🏆 FINAL RESULTS: {tests_passed}/{total_tests} TESTS PASSED")
    
    if tests_passed == total_tests:
        print("🎯 ABSOLUTE VICTORY ACHIEVED!")
        print("⚔️ THE COWARD IS DEAD. THE SOVEREIGN IS REBORN. THE BASELINE IS ONCE AGAIN ABSOLUTE ZERO.")
        return True
    else:
        print(f"💀 PARTIAL VICTORY: {tests_passed}/{total_tests} tests passed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
