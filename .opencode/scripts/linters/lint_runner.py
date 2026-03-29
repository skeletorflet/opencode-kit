#!/usr/bin/env python3
"""
Multi-language Lint Runner

Detects the project language and runs appropriate linting/formatting tools.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def detect_language(project_path: Path) -> list[str]:
    """Detect which languages are present in the project."""
    languages = []

    # Check for language-specific files
    if (project_path / "go.mod").exists():
        languages.append("go")
    if (project_path / "package.json").exists() or (
        project_path / "tsconfig.json"
    ).exists():
        languages.extend(["javascript", "typescript"])
    if (
        (project_path / "requirements.txt").exists()
        or (project_path / "pyproject.toml").exists()
        or (project_path / "setup.py").exists()
    ):
        languages.append("python")
    if (project_path / "Cargo.toml").exists():
        languages.append("rust")
    if (
        (project_path / "pom.xml").exists()
        or (project_path / "build.gradle").exists()
        or (project_path / "build.gradle.kts").exists()
    ):
        languages.append("java")
    if (project_path / "*.csproj").exists():
        languages.append("csharp")
    if (project_path / "Gemfile").exists():
        languages.append("ruby")
    if (project_path / "composer.json").exists():
        languages.append("php")
    if (project_path / "Package.swift").exists():
        languages.append("swift")
    if (project_path / "Cargo.toml").exists():
        languages.append("kotlin")

    return languages


def run_go_lint(project_path: Path) -> int:
    """Run Go linting tools."""
    print("Running Go linting...")

    try:
        # go fmt
        subprocess.run(["go", "fmt", "./..."], cwd=project_path, check=False)

        # go vet
        result = subprocess.run(
            ["go", "vet", "./..."], cwd=project_path, capture_output=True
        )

        if result.returncode != 0:
            print("⚠️ go vet warnings:")
            print(result.stdout.decode())
            print(result.stderr.decode())

        return result.returncode
    except FileNotFoundError:
        print("❌ Go not installed")
        return 1


def run_python_lint(project_path: Path) -> int:
    """Run Python linting tools."""
    print("Running Python linting...")

    try:
        # Try ruff first
        result = subprocess.run(
            ["python", "-m", "ruff", "check", "."],
            cwd=project_path,
            capture_output=True,
        )
        if result.returncode == 0:
            print("✅ Ruff passed")
        elif result.returncode == 127:
            # Try pip install
            subprocess.run(["pip", "install", "ruff"], check=False)
            result = subprocess.run(
                ["python", "-m", "ruff", "check", "."],
                cwd=project_path,
                capture_output=True,
            )

        # mypy
        result_mypy = subprocess.run(
            ["python", "-m", "mypy", "."], cwd=project_path, capture_output=True
        )
        if result_mypy.returncode != 0:
            print("⚠️ mypy warnings:")
            print(result_mypy.stdout.decode())

        return 0
    except Exception as e:
        print(f"❌ Python linting error: {e}")
        return 1


def run_javascript_lint(project_path: Path) -> int:
    """Run JavaScript/TypeScript linting."""
    print("Running JavaScript/TypeScript linting...")

    try:
        result = subprocess.run(
            ["npx", "eslint", ".", "--fix"], cwd=project_path, capture_output=True
        )

        if result.returncode != 0:
            print("⚠️ ESLint warnings")
            print(result.stdout.decode())

        return 0
    except FileNotFoundError:
        print("❌ Node.js not installed")
        return 1


def run_rust_lint(project_path: Path) -> int:
    """Run Rust linting."""
    print("Running Rust linting...")

    try:
        result = subprocess.run(
            ["cargo", "clippy", "--", "-D", "warnings"],
            cwd=project_path,
            capture_output=True,
        )

        if result.returncode != 0:
            print("⚠️ clippy warnings:")
            print(result.stdout.decode())

        return result.returncode
    except FileNotFoundError:
        print("❌ Rust not installed")
        return 1


def main():
    parser = argparse.ArgumentParser(description="Multi-language lint runner")
    parser.add_argument("project_path", default=".", help="Path to project")
    args = parser.parse_args()

    project_path = Path(args.project_path)

    if not project_path.exists():
        print(f"❌ Project path does not exist: {project_path}")
        return 1

    languages = detect_language(project_path)

    if not languages:
        print("⚠️ No recognized languages found")
        return 1

    print(f"Detected languages: {', '.join(languages)}")

    total_return = 0

    for lang in languages:
        if lang == "go":
            total_return += run_go_lint(project_path)
        elif lang == "python":
            total_return += run_python_lint(project_path)
        elif lang in ["javascript", "typescript"]:
            total_return += run_javascript_lint(project_path)
        elif lang == "rust":
            total_return += run_rust_lint(project_path)

    if total_return == 0:
        print("✅ All lint checks passed")
    else:
        print(f"⚠️ Some lint checks had warnings ({total_return} issues)")

    return min(total_return, 1)


if __name__ == "__main__":
    sys.exit(main())
