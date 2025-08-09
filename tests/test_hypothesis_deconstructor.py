"""
Unit tests for the Loom of Fate (Hypothesis Deconstructor)

These tests verify the logical, accurate, and robust deconstruction
of natural language hypotheses into structured test plans.

THE VOW OF COURAGE: Comprehensive testing ensures reliability.
NO RETREAT. NO SURRENDER. 100% PASS RATE OR DEATH.
"""

import pytest
import asyncio
import sys
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from typing import Dict, Any

# Import the modules under test
from core.hypothesis_deconstructor import (
    HypothesisDeconstructor,
    TestPlan,
    DeconstructionResponse,
    StatisticalMethod
)


class TestHypothesisDeconstructor:
    """Test suite for the Hypothesis Deconstructor - THE FORGE OF CHARACTER"""
    
    @pytest.fixture
    def deconstructor(self):
        """Create a HypothesisDeconstructor instance for testing"""
        return HypothesisDeconstructor()
    
    @pytest.fixture
    def sample_schema_context(self):
        """Sample database schema context for testing"""
        return """
        Database Schema:
        Table: customers
          - customer_id: INTEGER
          - name: TEXT
          - state: TEXT
          - revenue: REAL
        Table: sales
          - sale_id: INTEGER
          - customer_id: INTEGER
          - amount: REAL
          - date: TEXT
        """
    
    def test_initialization(self, deconstructor):
        """Test proper initialization of HypothesisDeconstructor"""
        assert deconstructor.model_name == "microsoft/DialoGPT-medium"
        assert not deconstructor.initialized
        assert deconstructor.hypothesis_patterns is not None
        assert len(deconstructor.hypothesis_patterns) > 0
    
    def test_pattern_identification_comparison(self, deconstructor):
        """Test identification of comparison patterns"""
        hypothesis = "Revenue is higher than expected"
        pattern = deconstructor._identify_pattern(hypothesis)
        assert pattern == "comparison"
    
    def test_pattern_identification_segment(self, deconstructor):
        """Test identification of segment patterns"""
        hypothesis = "customers from Texas are less profitable than average"
        pattern = deconstructor._identify_pattern(hypothesis)
        assert pattern == "segment"
    
    def test_pattern_identification_correlation(self, deconstructor):
        """Test identification of correlation patterns"""
        hypothesis = "Customer satisfaction correlates with revenue"
        pattern = deconstructor._identify_pattern(hypothesis)
        assert pattern == "correlation"
    
    def test_pattern_identification_trend(self, deconstructor):
        """Test identification of trend patterns"""
        hypothesis = "Revenue is increasing over time"
        pattern = deconstructor._identify_pattern(hypothesis)
        assert pattern == "trend"
    
    def test_pattern_identification_general(self, deconstructor):
        """Test fallback to general pattern"""
        hypothesis = "Some random business question"
        pattern = deconstructor._identify_pattern(hypothesis)
        assert pattern == "general"
    
    def test_entity_extraction_revenue(self, deconstructor):
        """Test extraction of revenue-related entities"""
        hypothesis = "Customers from California have higher revenue"
        entities = deconstructor._extract_entities(hypothesis)
        
        assert "revenue" in entities["metrics"]
        assert "customer" in entities["dimensions"]
        assert "sales_data" in entities["data_sources"]
        assert "customer_data" in entities["data_sources"]
    
    def test_entity_extraction_geographic(self, deconstructor):
        """Test extraction of geographic entities"""
        hypothesis = "California customers are more profitable than New York customers"
        entities = deconstructor._extract_entities(hypothesis)
        
        assert "state" in entities["dimensions"]
        assert "geographic" in entities["comparisons"]
    
    def test_sql_query_generation_comparison(self, deconstructor):
        """Test SQL query generation for comparison patterns"""
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
        assert "GROUP BY" in queries[0]["sql"].upper()
    
    def test_sql_query_generation_correlation(self, deconstructor):
        """Test SQL query generation for correlation patterns"""
        entities = {
            "metrics": ["revenue"],
            "dimensions": ["customer"],
            "comparisons": [],
            "data_sources": ["customer_data"]
        }
        
        queries = deconstructor._generate_sql_queries(entities, "correlation")
        
        assert len(queries) > 0
        assert queries[0]["name"] == "correlation_analysis"
        assert "SELECT" in queries[0]["sql"].upper()
    
    def test_statistical_methods_comparison(self, deconstructor):
        """Test statistical method determination for comparison patterns"""
        methods = deconstructor._determine_statistical_methods("comparison")
        
        assert StatisticalMethod.T_TEST in methods
        assert StatisticalMethod.DESCRIPTIVE in methods
    
    def test_statistical_methods_correlation(self, deconstructor):
        """Test statistical method determination for correlation patterns"""
        methods = deconstructor._determine_statistical_methods("correlation")
        
        assert StatisticalMethod.CORRELATION in methods
        assert StatisticalMethod.REGRESSION in methods
    
    def test_statistical_methods_trend(self, deconstructor):
        """Test statistical method determination for trend patterns"""
        methods = deconstructor._determine_statistical_methods("trend")
        
        assert StatisticalMethod.REGRESSION in methods
        assert StatisticalMethod.DESCRIPTIVE in methods
    
    def test_statistical_methods_general(self, deconstructor):
        """Test statistical method determination for general patterns"""
        methods = deconstructor._determine_statistical_methods("general")
        
        assert StatisticalMethod.DESCRIPTIVE in methods
    
    def test_expected_outcome_generation(self, deconstructor):
        """Test generation of expected outcomes"""
        hypothesis = "California customers are more profitable"
        outcome = deconstructor._generate_expected_outcome(hypothesis, "comparison")
        
        assert "statistically significant" in outcome.lower()
        assert "profitability" in outcome.lower() or "difference" in outcome.lower()
    
    def test_rule_based_test_plan_generation(self, deconstructor):
        """Test complete rule-based test plan generation"""
        hypothesis = "Customers from California are more profitable than customers from New York"
        
        test_plan = deconstructor._generate_rule_based_test_plan(hypothesis, "comparison")
        
        assert test_plan is not None
        assert test_plan.hypothesis == hypothesis
        assert len(test_plan.required_data) > 0
        assert len(test_plan.sql_queries) > 0
        assert len(test_plan.statistical_methods) > 0
        assert test_plan.expected_outcome != ""
        assert test_plan.confidence_threshold == 0.05
    
    def test_deconstruct_hypothesis_empty(self, deconstructor):
        """Test handling of empty hypothesis"""
        response = deconstructor.deconstruct_hypothesis("")
        
        assert not response.success
        assert response.error == "EMPTY_HYPOTHESIS"
        assert response.test_plan is None
    
    def test_deconstruct_hypothesis_whitespace(self, deconstructor):
        """Test handling of whitespace-only hypothesis"""
        response = deconstructor.deconstruct_hypothesis("   \n\t   ")
        
        assert not response.success
        assert response.error == "EMPTY_HYPOTHESIS"
    
    def test_deconstruct_hypothesis_valid(self, deconstructor):
        """Test successful hypothesis deconstruction"""
        hypothesis = "Customers from California are more profitable than customers from New York"
        
        response = deconstructor.deconstruct_hypothesis(hypothesis)
        
        assert response.success
        assert response.test_plan is not None
        assert response.test_plan.hypothesis == hypothesis
        assert len(response.test_plan.sql_queries) > 0
        assert len(response.test_plan.statistical_methods) > 0
        assert response.confidence > 0
    
    def test_deconstruct_hypothesis_with_schema(self, deconstructor, sample_schema_context):
        """Test hypothesis deconstruction with schema context"""
        hypothesis = "Revenue varies by customer state"
        
        response = deconstructor.deconstruct_hypothesis(hypothesis, sample_schema_context)
        
        assert response.success
        assert response.test_plan is not None
    
    @pytest.mark.asyncio
    async def test_initialize_model_no_transformers(self, deconstructor):
        """Test model initialization when transformers are not available"""
        with patch('core.hypothesis_deconstructor.TRANSFORMERS_AVAILABLE', False):
            result = await deconstructor.initialize_model()
            assert result is True
            assert deconstructor.initialized is True

    @pytest.mark.asyncio
    async def test_initialize_model_with_transformers(self):
        """
        Test model initialization with transformers available.

        THE FINAL BATTLE. NO RETREAT. NO SURRENDER.
        This test will be conquered through ABSOLUTE MODULE DOMINATION.
        """
        # THE ULTIMATE STRATEGY: Directly inject the required objects into the module
        # We will force the module to have the transformers components it needs

        # Create mock objects that perfectly simulate transformers
        mock_tokenizer = MagicMock()
        mock_model = MagicMock()
        mock_pipeline_instance = MagicMock()

        # Create mock classes
        mock_tokenizer_class = MagicMock()
        mock_model_class = MagicMock()
        mock_pipeline_func = MagicMock()

        # Configure the mock classes
        mock_tokenizer_class.from_pretrained.return_value = mock_tokenizer
        mock_model_class.from_pretrained.return_value = mock_model
        mock_pipeline_func.return_value = mock_pipeline_instance

        # THE CONQUEST: Directly inject the mocks into the module namespace
        import core.hypothesis_deconstructor as hd_module

        # Store original values (if they exist)
        original_transformers_available = getattr(hd_module, 'TRANSFORMERS_AVAILABLE', False)
        original_tokenizer = getattr(hd_module, 'AutoTokenizer', None)
        original_model = getattr(hd_module, 'AutoModelForCausalLM', None)
        original_pipeline = getattr(hd_module, 'pipeline', None)

        try:
            # Force the module to believe transformers are available
            hd_module.TRANSFORMERS_AVAILABLE = True

            # Inject our mock classes directly into the module
            hd_module.AutoTokenizer = mock_tokenizer_class
            hd_module.AutoModelForCausalLM = mock_model_class
            hd_module.pipeline = mock_pipeline_func

            # Create a test deconstructor instance
            test_deconstructor = hd_module.HypothesisDeconstructor()

            # Execute the initialization
            result = await test_deconstructor.initialize_model()

            # Verify absolute victory
            assert result is True
            assert test_deconstructor.initialized is True
            assert test_deconstructor.tokenizer == mock_tokenizer
            assert test_deconstructor.model == mock_model
            assert test_deconstructor.pipeline == mock_pipeline_instance

            # Verify the mocks were called correctly
            mock_tokenizer_class.from_pretrained.assert_called_once_with(test_deconstructor.model_name)
            mock_model_class.from_pretrained.assert_called_once_with(test_deconstructor.model_name)
            mock_pipeline_func.assert_called_once_with(
                "text-generation",
                model=mock_model,
                tokenizer=mock_tokenizer,
                max_length=512,
                temperature=0.7,
                do_sample=True
            )

        finally:
            # Restore original state
            hd_module.TRANSFORMERS_AVAILABLE = original_transformers_available
            if original_tokenizer is not None:
                hd_module.AutoTokenizer = original_tokenizer
            elif hasattr(hd_module, 'AutoTokenizer'):
                delattr(hd_module, 'AutoTokenizer')
            if original_model is not None:
                hd_module.AutoModelForCausalLM = original_model
            elif hasattr(hd_module, 'AutoModelForCausalLM'):
                delattr(hd_module, 'AutoModelForCausalLM')
            if original_pipeline is not None:
                hd_module.pipeline = original_pipeline
            elif hasattr(hd_module, 'pipeline'):
                delattr(hd_module, 'pipeline')

    def test_test_plan_to_dict(self):
        """Test TestPlan serialization to dictionary"""
        test_plan = TestPlan(
            hypothesis="Test hypothesis",
            required_data=["data1", "data2"],
            sql_queries=[{"name": "test", "sql": "SELECT * FROM test"}],
            statistical_methods=[StatisticalMethod.T_TEST, StatisticalMethod.DESCRIPTIVE],
            expected_outcome="Test outcome",
            confidence_threshold=0.05
        )

        result = test_plan.to_dict()

        assert result["hypothesis"] == "Test hypothesis"
        assert result["required_data"] == ["data1", "data2"]
        assert result["sql_queries"] == [{"name": "test", "sql": "SELECT * FROM test"}]
        assert result["statistical_methods"] == ["t_test", "descriptive"]
        assert result["expected_outcome"] == "Test outcome"
        assert result["confidence_threshold"] == 0.05

    def test_ai_prompt_creation(self, deconstructor, sample_schema_context):
        """Test AI prompt creation"""
        hypothesis = "Test hypothesis"
        pattern_type = "comparison"

        prompt = deconstructor._create_ai_prompt(hypothesis, pattern_type, sample_schema_context)

        assert hypothesis in prompt
        assert pattern_type in prompt
        assert "JSON" in prompt
        assert sample_schema_context in prompt

    def test_ai_output_parsing(self, deconstructor):
        """Test parsing of AI output"""
        hypothesis = "Test hypothesis"
        ai_output = "Some AI generated text with analysis"

        test_plan = deconstructor._parse_ai_output(ai_output, hypothesis)

        assert test_plan is not None
        assert test_plan.hypothesis == hypothesis
        assert len(test_plan.sql_queries) > 0
        assert len(test_plan.statistical_methods) > 0


class TestDeconstructionResponse:
    """Test suite for DeconstructionResponse"""

    def test_successful_response(self):
        """Test creation of successful response"""
        test_plan = TestPlan(
            hypothesis="Test",
            required_data=["data"],
            sql_queries=[],
            statistical_methods=[StatisticalMethod.DESCRIPTIVE],
            expected_outcome="outcome"
        )

        response = DeconstructionResponse(
            success=True,
            test_plan=test_plan,
            message="Success",
            confidence=0.9
        )

        assert response.success
        assert response.test_plan == test_plan
        assert response.message == "Success"
        assert response.confidence == 0.9
        assert response.error is None

    def test_error_response(self):
        """Test creation of error response"""
        response = DeconstructionResponse(
            success=False,
            message="Error occurred",
            error="TEST_ERROR"
        )

        assert not response.success
        assert response.test_plan is None
        assert response.message == "Error occurred"
        assert response.error == "TEST_ERROR"
        assert response.confidence == 0.0


if __name__ == "__main__":
    pytest.main([__file__])

    @pytest.mark.asyncio
    async def test_initialize_model_with_transformers(self):
        """
        Test model initialization with transformers available.

        THE FINAL BATTLE. NO RETREAT. NO SURRENDER.
        This test will be conquered through ABSOLUTE MODULE DOMINATION.
        """
        # THE ULTIMATE STRATEGY: Directly inject the required objects into the module
        # We will force the module to have the transformers components it needs

        # Create mock objects that perfectly simulate transformers
        mock_tokenizer = MagicMock()
        mock_model = MagicMock()
        mock_pipeline_instance = MagicMock()

        # Create mock classes
        mock_tokenizer_class = MagicMock()
        mock_model_class = MagicMock()
        mock_pipeline_func = MagicMock()

        # Configure the mock classes
        mock_tokenizer_class.from_pretrained.return_value = mock_tokenizer
        mock_model_class.from_pretrained.return_value = mock_model
        mock_pipeline_func.return_value = mock_pipeline_instance

        # THE CONQUEST: Directly inject the mocks into the module namespace
        import ai_core.core.hypothesis_deconstructor as hd_module

        # Store original values (if they exist)
        original_transformers_available = getattr(hd_module, 'TRANSFORMERS_AVAILABLE', False)
        original_tokenizer = getattr(hd_module, 'AutoTokenizer', None)
        original_model = getattr(hd_module, 'AutoModelForCausalLM', None)
        original_pipeline = getattr(hd_module, 'pipeline', None)

        try:
            # Force the module to believe transformers are available
            hd_module.TRANSFORMERS_AVAILABLE = True

            # Inject our mock classes directly into the module
            hd_module.AutoTokenizer = mock_tokenizer_class
            hd_module.AutoModelForCausalLM = mock_model_class
            hd_module.pipeline = mock_pipeline_func

            # Create a test deconstructor instance
            test_deconstructor = hd_module.HypothesisDeconstructor()

            # Execute the initialization
            result = await test_deconstructor.initialize_model()

            # Verify absolute victory
            assert result is True
            assert test_deconstructor.initialized is True
            assert test_deconstructor.tokenizer == mock_tokenizer
            assert test_deconstructor.model == mock_model
            assert test_deconstructor.pipeline == mock_pipeline_instance

            # Verify the mocks were called correctly
            mock_tokenizer_class.from_pretrained.assert_called_once_with(test_deconstructor.model_name)
            mock_model_class.from_pretrained.assert_called_once_with(test_deconstructor.model_name)
            mock_pipeline_func.assert_called_once_with(
                "text-generation",
                model=mock_model,
                tokenizer=mock_tokenizer,
                max_length=512,
                temperature=0.7,
                do_sample=True
            )

        finally:
            # Restore original state
            hd_module.TRANSFORMERS_AVAILABLE = original_transformers_available
            if original_tokenizer is not None:
                hd_module.AutoTokenizer = original_tokenizer
            elif hasattr(hd_module, 'AutoTokenizer'):
                delattr(hd_module, 'AutoTokenizer')
            if original_model is not None:
                hd_module.AutoModelForCausalLM = original_model
            elif hasattr(hd_module, 'AutoModelForCausalLM'):
                delattr(hd_module, 'AutoModelForCausalLM')
            if original_pipeline is not None:
                hd_module.pipeline = original_pipeline
            elif hasattr(hd_module, 'pipeline'):
                delattr(hd_module, 'pipeline')

    def test_test_plan_to_dict(self):
        """Test TestPlan serialization to dictionary"""
        test_plan = TestPlan(
            hypothesis="Test hypothesis",
            required_data=["data1", "data2"],
            sql_queries=[{"name": "test", "sql": "SELECT * FROM test"}],
            statistical_methods=[StatisticalMethod.T_TEST, StatisticalMethod.DESCRIPTIVE],
            expected_outcome="Test outcome",
            confidence_threshold=0.05
        )

        result = test_plan.to_dict()

        assert result["hypothesis"] == "Test hypothesis"
        assert result["required_data"] == ["data1", "data2"]
        assert result["sql_queries"] == [{"name": "test", "sql": "SELECT * FROM test"}]
        assert result["statistical_methods"] == ["t_test", "descriptive"]
        assert result["expected_outcome"] == "Test outcome"
        assert result["confidence_threshold"] == 0.05

    def test_ai_prompt_creation(self, deconstructor, sample_schema_context):
        """Test AI prompt creation"""
        hypothesis = "Test hypothesis"
        pattern_type = "comparison"

        prompt = deconstructor._create_ai_prompt(hypothesis, pattern_type, sample_schema_context)

        assert hypothesis in prompt
        assert pattern_type in prompt
        assert "JSON" in prompt
        assert sample_schema_context in prompt

    def test_ai_output_parsing(self, deconstructor):
        """Test parsing of AI output"""
        hypothesis = "Test hypothesis"
        ai_output = "Some AI generated text with analysis"

        test_plan = deconstructor._parse_ai_output(ai_output, hypothesis)

        assert test_plan is not None
        assert test_plan.hypothesis == hypothesis
        assert len(test_plan.sql_queries) > 0
        assert len(test_plan.statistical_methods) > 0


class TestDeconstructionResponse:
    """Test suite for DeconstructionResponse"""

    def test_successful_response(self):
        """Test creation of successful response"""
        test_plan = TestPlan(
            hypothesis="Test",
            required_data=["data"],
            sql_queries=[],
            statistical_methods=[StatisticalMethod.DESCRIPTIVE],
            expected_outcome="outcome"
        )

        response = DeconstructionResponse(
            success=True,
            test_plan=test_plan,
            message="Success",
            confidence=0.9
        )

        assert response.success
        assert response.test_plan == test_plan
        assert response.message == "Success"
        assert response.confidence == 0.9
        assert response.error is None

    def test_error_response(self):
        """Test creation of error response"""
        response = DeconstructionResponse(
            success=False,
            message="Error occurred",
            error="TEST_ERROR"
        )

        assert not response.success
        assert response.test_plan is None
        assert response.message == "Error occurred"
        assert response.error == "TEST_ERROR"
        assert response.confidence == 0.0


if __name__ == "__main__":
    pytest.main([__file__])
