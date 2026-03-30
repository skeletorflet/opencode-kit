#!/usr/bin/env python3
"""
Markdown Validator for OpenCode Kit

Validates agents, skills, and templates for:
- Valid YAML frontmatter
- Required fields
- Internal link consistency
- Markdown syntax
"""

import argparse
import os
import re
import sys
from pathlib import Path


def validate_frontmatter(content: str, file_path: str) -> list[str]:
    """Validate YAML frontmatter in markdown files."""
    errors = []

    # Check if file has frontmatter
    if not content.startswith("---"):
        errors.append(f"{file_path}: Missing YAML frontmatter")
        return errors

    # Extract frontmatter
    parts = content.split("---", 2)
    if len(parts) < 3:
        errors.append(f"{file_path}: Invalid frontmatter format")
        return errors

    frontmatter = parts[1]

    # Check required fields for agents
    if "/agents/" in file_path:
        if "name:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'name' field in frontmatter")
        if "description:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'description' field in frontmatter")
        if "tools:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'tools' field in frontmatter")

    # Check required fields for skills
    if "/skills/" in file_path and "SKILL.md" in file_path:
        if "name:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'name' field in frontmatter")
        if "description:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'description' field in frontmatter")

    # Check required fields for templates
    if "/templates/" in file_path and "TEMPLATE.md" in file_path:
        if "name:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'name' field in frontmatter")
        if "description:" not in frontmatter:
            errors.append(f"{file_path}: Missing 'description' field in frontmatter")

    return errors


def validate_internal_links(content: str, file_path: str, base_dir: Path) -> list[str]:
    """Validate internal links in markdown files."""
    errors = []

    # Find all markdown links
    link_pattern = r"\[([^\]]+)\]\(([^)]+)\)"
    matches = re.findall(link_pattern, content)

    for link_text, link_url in matches:
        # Skip external URLs
        if link_url.startswith(("http://", "https://", "mailto:", "#")):
            continue

        # Handle relative paths
        if link_url.startswith("./") or link_url.startswith("../"):
            current_dir = Path(file_path).parent
            target_path = (current_dir / link_url).resolve()
        else:
            target_path = (base_dir / link_url).resolve()

        # Check if target exists
        if not target_path.exists():
            errors.append(f"{file_path}: Broken link: {link_url}")

    return errors


def validate_markdown_syntax(content: str, file_path: str) -> list[str]:
    """Validate basic markdown syntax."""
    errors = []
    lines = content.split("\n")

    for i, line in enumerate(lines, 1):
        # Check for unclosed code blocks
        if line.strip().startswith("```"):
            # Count opening and closing code blocks
            pass

        # Check for broken headers (no space after #)
        header_match = re.match(r"^(#{1,6})([^ #\n])", line)
        if header_match:
            errors.append(f"{file_path}:{i}: Header missing space after #")

        # Check for broken links (common mistakes)
        if re.search(r"\]\([^)]*\s[^)]*\)", line) and not re.search(
            r'\]\([^)]*["\']', line
        ):
            # Links with spaces should be encoded or quoted
            if not line.strip().startswith("```"):
                errors.append(f"{file_path}:{i}: Link contains unencoded spaces")

    return errors


def validate_agent_file(file_path: Path, base_dir: Path) -> list[str]:
    """Validate an agent markdown file."""
    errors = []

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        errors.append(f"{file_path}: Cannot read file: {e}")
        return errors

    errors.extend(validate_frontmatter(content, str(file_path)))
    errors.extend(validate_internal_links(content, str(file_path), base_dir))
    errors.extend(validate_markdown_syntax(content, str(file_path)))

    return errors


def validate_skill_file(file_path: Path, base_dir: Path) -> list[str]:
    """Validate a skill markdown file."""
    errors = []

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        errors.append(f"{file_path}: Cannot read file: {e}")
        return errors

    errors.extend(validate_frontmatter(content, str(file_path)))
    errors.extend(validate_internal_links(content, str(file_path), base_dir))
    errors.extend(validate_markdown_syntax(content, str(file_path)))

    return errors


def validate_template_file(file_path: Path, base_dir: Path) -> list[str]:
    """Validate a template markdown file."""
    errors = []

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        errors.append(f"{file_path}: Cannot read file: {e}")
        return errors

    errors.extend(validate_frontmatter(content, str(file_path)))
    errors.extend(validate_internal_links(content, str(file_path), base_dir))
    errors.extend(validate_markdown_syntax(content, str(file_path)))

    return errors


def main():
    parser = argparse.ArgumentParser(description="Markdown validator for OpenCode Kit")
    parser.add_argument(
        "path", help="Path to validate (agents/, skills/, or templates/)"
    )
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    args = parser.parse_args()

    base_dir = Path(args.path).resolve()
    if not base_dir.exists():
        print(f"[ERROR] Path does not exist: {base_dir}")
        return 1

    all_errors = []
    file_count = 0

    # Determine what type of files to validate
    if "agents" in str(base_dir):
        pattern = "**/*.md"
        validator = validate_agent_file
        print(f"[SEARCH] Validating agents in: {base_dir}")
    elif "skills" in str(base_dir):
        pattern = "**/*.md"
        validator = validate_skill_file
        print(f"[SEARCH] Validating skills in: {base_dir}")
    elif "templates" in str(base_dir):
        pattern = "**/*.md"
        validator = validate_template_file
        print(f"[SEARCH] Validating templates in: {base_dir}")
    else:
        # Validate all markdown files
        pattern = "**/*.md"
        validator = validate_agent_file  # Generic validator
        print(f"[SEARCH] Validating all markdown files in: {base_dir}")

    for md_file in base_dir.glob(pattern):
        if md_file.is_file():
            file_count += 1
            errors = validator(md_file, base_dir)
            all_errors.extend(errors)

            if args.verbose and not errors:
                print(f"  [OK] {md_file.relative_to(base_dir)}")

    # Print results
    print(f"\n[SUMMARY] Summary:")
    print(f"   Files checked: {file_count}")
    print(f"   Errors found: {len(all_errors)}")

    if all_errors:
        print(f"\n[ERROR] Errors:")
        for error in all_errors:
            print(f"   {error}")
        return 1
    else:
        print("\n[OK] All validations passed!")
        return 0


if __name__ == "__main__":
    sys.exit(main())
