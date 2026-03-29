#!/usr/bin/env python3
"""
Multi-language Test Runner

Detects the project language and runs appropriate test framework.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def detect_language(project_path: Path) -> str:
    """Detect primary language of the project."""

    if (project_path / "go.mod").exists():
        return "go"
    if (project_path / "requirements.txt").exists() or (
        project_path / "pyproject.toml"
    ).exists():
        return "python"
    if (project_path / "Cargo.toml").exists():
        return "rust"
    if (project_path / "pom.xml").exists():
        return "java"
    if (project_path / "package.json").exists():
        return "javascript"
    if (project_path / "Gemfile").exists():
        return "ruby"
    if (project_path / "composer.json").exists():
        return "php"
    if (project_path / "*.csproj").exists():
        return "csharp"

    return "unknown"


def run_go_tests(project_path: Path) -> int:
    """Run Go tests."""
    print("Running Go tests...")
    result = subprocess.run(
        ["go", "test", "-v", "-race", "./..."], cwd=project_path, capture_output=True
    )
    print(result.stdout.decode())
    return result.returncode


def run_python_tests(project_path: Path) -> int:
    """Run Python tests."""
    print("Running Python tests...")
    result = subprocess.run(
        ["python", "-m", "pytest", "-v", "--tb=short"],
        cwd=project_path,
        capture_output=True,
    )
    print(result.stdout.decode())
    return result.returncode


def run_rust_tests(project_path: Path) -> int:
    """Run Rust tests."""
    print("Running Rust tests...")
    result = subprocess.run(
        ["cargo", "test", "--all"], cwd=project_path, capture_output=True
    )
    print(result.stdout.decode())
    return result.returncode


def run_java_tests(project_path: Path) -> int:
    """Run Java tests."""
    print("Running Java tests...")

    if (project_path / "pom.xml").exists():
        result = subprocess.run(["mvn", "test"], cwd=project_path, capture_output=True)
    else:
        result = subprocess.run(
            ["gradle", "test"], cwd=project_path, capture_output=True
        )

    print(result.stdout.decode())
    return result.returncode


def run_javascript_tests(project_path: Path) -> int:
    """Run JavaScript/TypeScript tests."""
    print("Running JavaScript tests...")
    result = subprocess.run(
        ["npm", "test", "--", "--coverage"], cwd=project_path, capture_output=True
    )
    print(result.stdout.decode())
    return result.returncode


def run_ruby_tests(project_path: Path) -> int:
    """Run Ruby tests."""
    print("Running Ruby tests...")
    result = subprocess.run(
        ["bundle", "exec", "rspec"], cwd=project_path, capture_output=True
    )
    print(result.stdout.decode())
    return result.returncode


def run_csharp_tests(project_path: Path) -> int:
    """Run C# tests."""
    print("Running C# tests...")
    result = subprocess.run(["dotnet", "test"], cwd=project_path, capture_output=True)
    print(result.stdout.decode())
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description="Multi-language test runner")
    parser.add_argument("project_path", default=".", help="Path to project")
    args = parser.parse_args()

    project_path = Path(args.project_path)
    language = detect_language(project_path)

    print(f"Detected language: {language}")

    if language == "go":
        return run_go_tests(project_path)
    elif language == "python":
        return run_python_tests(project_path)
    elif language == "rust":
        return run_rust_tests(project_path)
    elif language == "java":
        return run_java_tests(project_path)
    elif language == "javascript":
        return run_javascript_tests(project_path)
    elif language == "ruby":
        return run_ruby_tests(project_path)
    elif language == "csharp":
        return run_csharp_tests(project_path)
    else:
        print(f"❌ Unknown language: {language}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
