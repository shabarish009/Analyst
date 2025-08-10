# 🔬 Symbiotic Analysis Environment

> **A revolutionary data analysis platform that seamlessly bridges Excel, SQL, AI, and interactive dashboards in one unified workspace.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/shabarish009/Analyst)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](package.json)
[![Tauri](https://img.shields.io/badge/Tauri-2.7.0-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)

## ✨ What Makes It Special

The Symbiotic Analysis Environment isn't just another data tool—it's a **living ecosystem** where every component works in perfect harmony. Upload a CSV file, and instantly query it with SQL. Generate AI-powered insights, and watch them flow seamlessly into interactive dashboards. Test hypotheses with a single click, and let the system autonomously plan and execute the analysis.

### 🎯 Core Philosophy: **True Symbiosis**

- **Unbreakable Chains**: Every data source becomes instantly available across all tools
- **AI-First Design**: Intelligent assistance at every step, from SQL generation to insight discovery
- **Zero Context Switching**: Work with Excel, SQL, and dashboards in one unified interface
- **Autonomous Intelligence**: The system thinks ahead, plans, and executes complex analyses

## 🚀 Key Features

### 📊 **Excel Analyst**
- **Native file support**: CSV, Excel, and more
- **Instant data preview** with smart grid rendering
- **Automatic session registration** for cross-tool access

### 🔍 **SQL Analyst**
- **AI-powered SQL generation** from natural language
- **Schema-aware query assistance**
- **Real-time query execution** with beautiful result grids
- **Cross-source querying** (CSV files, databases, previous results)

### 📈 **Dashboard Creator**
- **Drag-and-drop widgets**: Bar charts, KPI stats, line graphs
- **Multi-source data binding** from any session source
- **AI-generated insights** that understand your entire data context
- **Real-time updates** as data changes

### 🧪 **Hypothesis Tester**
- **Natural language hypothesis input**
- **Autonomous planning and execution**
- **Intelligent tool orchestration** (automatically uses SQL Analyst, etc.)
- **Clear verdict presentation** with supporting evidence

### 🔗 **Connection Manager**
- **Universal database connectivity** (SQLite, PostgreSQL, MySQL, etc.)
- **Secure credential management**
- **Schema introspection** for AI-powered assistance

### 🎨 **Collaborative Whiteboard**
- **Real-time collaboration** for team analysis sessions
- **Visual data exploration** and annotation
- **Integrated with all analysis tools**

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** with TypeScript
- **Tauri 2.7.0** for native desktop performance
- **Vite** for lightning-fast development
- **CodeMirror** for advanced SQL editing
- **Zustand** for reactive state management

### Backend
- **Rust** (Tauri) for high-performance native operations
- **SQLite/PostgreSQL** for data storage
- **Python AI Core** for intelligent features
- **FastAPI** for AI service endpoints

### AI & Intelligence
- **Custom AI bridges** for SQL generation and insights
- **Schema-aware query assistance**
- **Multi-modal data analysis**
- **Autonomous hypothesis testing**

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Rust** 1.77.2+ (for Tauri)
- **Python** 3.10+ (for AI features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/shabarish009/Analyst.git
cd Analyst

# Install dependencies
npm install

# Install Python AI dependencies
cd ai_core
pip install -e .
cd ..

# Start development server
npm run dev

# Or build for production
npm run build
```

### Running the Application

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🎮 Usage

### 1. **Load Your Data**
- Click "File > Open" to load CSV/Excel files
- Or connect to databases via Connection Manager
- Data becomes instantly available across all tools

### 2. **Explore with SQL**
- Open SQL Analyst
- Type natural language: *"Show me customers with orders over $1000"*
- Click "Generate SQL" for AI assistance
- Execute and see results in beautiful grids

### 3. **Create Dashboards**
- Open Dashboard Creator
- Add widgets (Bar Chart, KPI, Line Graph)
- Bind to any data source (CSV, SQL results, etc.)
- Generate AI insights with one click

### 4. **Test Hypotheses**
- Open Hypothesis Tester
- Enter: *"I believe sales are higher on weekends"*
- Watch the system autonomously plan and execute analysis
- Get clear verdicts with supporting evidence

## 🏗️ Architecture

The Symbiotic Analysis Environment follows a **reactive dataflow architecture**:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Sources  │───▶│  Zustand Store   │───▶│  UI Components  │
│  (CSV, DB, etc) │    │ (Session Bus)    │    │ (React + Tauri) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   AI Services    │
                       │ (Python + Rust)  │
                       └──────────────────┘
```

### Key Principles
- **Session-based data flow**: All data sources register in a central session bus
- **Reactive updates**: Changes propagate automatically across all components
- **AI-first design**: Intelligence is embedded at every layer
- **Cross-platform native**: Tauri provides native performance with web technologies

## 🧪 Testing

The project maintains **Absolute Zero** with comprehensive testing:

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- src/sql/SQLAnalyst.test.tsx
npm test -- src/dashboard/DashboardCreator.test.tsx

# Run with coverage
npm test -- --coverage
```

### Test Coverage
- **Unit tests**: Individual component behavior
- **Integration tests**: Cross-component data flow
- **End-to-end tests**: Complete user workflows
- **AI bridge tests**: Intelligent feature validation

## 📚 Documentation

- **[Pantheon Audit Report](docs/Pantheon_Audit_Report.md)**: Comprehensive testing and validation report
- **[API Documentation](docs/api.md)**: Backend service endpoints *(coming soon)*
- **[Architecture Guide](docs/architecture.md)**: Technical deep dive *(coming soon)*
- **[Contributing Guide](CONTRIBUTING.md)**: How to contribute *(coming soon)*

## 🤝 Contributing

We welcome contributions! The Symbiotic Analysis Environment follows the **Covenant of Creation** methodology:

1. **True Vertical Slice**: Build complete, end-to-end features
2. **Unbreakable Chains**: Ensure seamless component integration
3. **Courage**: Comprehensive testing and error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with the **Covenant of Creation** methodology, emphasizing:
- **Symbiotic design** where every component enhances others
- **AI-first architecture** for intelligent user experiences
- **Absolute Zero** commitment to quality and testing

---

**Ready to revolutionize your data analysis workflow?** 🚀

[Get Started](#installation) | [View Demo](#usage) | [Read Docs](docs/) | [Contribute](#contributing)
