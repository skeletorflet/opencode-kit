#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Skills & Agents Audit Script
=============================
Audits all 71 skills and 34 agents in the Opencode Kit.
Checks: SKILL.md presence, scripts, agent references, encoding issues.
"""

import sys
import io
import os
from pathlib import Path

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent  # .opencode
SKILLS_DIR = ROOT / "skills"
AGENTS_DIR = ROOT / "agents"


def audit_skills():
    """Check all skill directories for SKILL.md and scripts."""
    print("=" * 70)
    print("  SKILLS AUDIT")
    print("=" * 70)

    if not SKILLS_DIR.exists():
        print(f"ERROR: Skills directory not found: {SKILLS_DIR}")
        return []

    skills = sorted([d.name for d in SKILLS_DIR.iterdir() if d.is_dir()])
    results = []

    for skill in skills:
        skill_path = SKILLS_DIR / skill
        skill_md = skill_path / "SKILL.md"
        scripts_dir = skill_path / "scripts"

        has_skill_md = skill_md.exists()
        scripts = []
        if scripts_dir.exists():
            scripts = sorted(
                [f.name for f in scripts_dir.iterdir() if f.suffix == ".py"]
            )

        # Check script syntax
        script_errors = []
        for script in scripts:
            script_path = scripts_dir / script
            try:
                with open(script_path, "r", encoding="utf-8") as f:
                    compile(f.read(), script, "exec")
            except SyntaxError as e:
                script_errors.append(f"{script}: {e}")
            except Exception as e:
                script_errors.append(f"{script}: {e}")

        status = "OK" if has_skill_md and not script_errors else "ISSUE"
        results.append(
            {
                "name": skill,
                "has_skill_md": has_skill_md,
                "scripts": scripts,
                "script_errors": script_errors,
                "status": status,
            }
        )

        icon = "OK" if has_skill_md else "MISSING"
        script_info = f" [{len(scripts)} scripts]" if scripts else ""
        error_info = ""
        if script_errors:
            error_info = f" ERRORS: {', '.join(script_errors)}"
        print(
            f"  {icon:7s} | {skill:30s} | SKILL.md: {has_skill_md!s:5s}{script_info}{error_info}"
        )

    print(f"\n  Total skills: {len(skills)}")
    ok_count = sum(1 for r in results if r["status"] == "OK")
    issue_count = sum(1 for r in results if r["status"] == "ISSUE")
    no_skill_md = sum(1 for r in results if not r["has_skill_md"])
    print(f"  OK: {ok_count} | Issues: {issue_count} | Missing SKILL.md: {no_skill_md}")

    return results


def audit_agents():
    """Check all agent files for valid structure and skill references."""
    print("\n" + "=" * 70)
    print("  AGENTS AUDIT")
    print("=" * 70)

    if not AGENTS_DIR.exists():
        print(f"ERROR: Agents directory not found: {AGENTS_DIR}")
        return []

    agent_files = sorted([f for f in AGENTS_DIR.iterdir() if f.suffix == ".md"])
    results = []

    for agent_file in agent_files:
        name = agent_file.stem
        try:
            content = agent_file.read_text(encoding="utf-8")
        except Exception as e:
            print(f"  ERROR | {name:30s} | Cannot read: {e}")
            results.append({"name": name, "status": "ERROR", "error": str(e)})
            continue

        has_frontmatter = content.startswith("---")
        has_name = "name:" in content
        has_description = "description:" in content
        has_permissions = "permission:" in content

        # Extract skills from frontmatter
        skills_refs = []
        in_frontmatter = False
        for line in content.split("\n"):
            if line.strip() == "---":
                if in_frontmatter:
                    break
                in_frontmatter = True
                continue
            if in_frontmatter and "skills:" in line:
                # Parse skills list
                skills_part = line.split("skills:")[-1].strip()
                if skills_part.startswith("["):
                    skills_refs = [
                        s.strip().strip("[]").strip("'").strip('"')
                        for s in skills_part.split(",")
                    ]
                else:
                    skills_refs = [skills_part.strip()]

        issues = []
        if not has_frontmatter:
            issues.append("No frontmatter")
        if not has_name:
            issues.append("No name field")
        if not has_description:
            issues.append("No description")
        if not has_permissions:
            issues.append("No permissions")

        status = "OK" if not issues else "ISSUE"
        results.append(
            {
                "name": name,
                "status": status,
                "has_frontmatter": has_frontmatter,
                "skills_refs": skills_refs,
                "issues": issues,
            }
        )

        icon = "OK" if status == "OK" else "ISSUE"
        skill_info = f" skills: {', '.join(skills_refs)}" if skills_refs else ""
        issue_info = f" ISSUES: {', '.join(issues)}" if issues else ""
        print(
            f"  {icon:7s} | {name:30s} | Frontmatter: {has_frontmatter!s:5s}{skill_info}{issue_info}"
        )

    print(f"\n  Total agents: {len(agent_files)}")
    ok_count = sum(1 for r in results if r["status"] == "OK")
    issue_count = sum(1 for r in results if r["status"] == "ISSUE")
    print(f"  OK: {ok_count} | Issues: {issue_count}")

    return results


def audit_scripts_encoding():
    """Test all Python scripts for encoding issues on Windows."""
    print("\n" + "=" * 70)
    print("  ENCODING AUDIT (Windows compatibility)")
    print("=" * 70)

    all_py = sorted(ROOT.rglob("*.py"))
    issues = []

    for py_file in all_py:
        rel = py_file.relative_to(ROOT)
        try:
            content = py_file.read_text(encoding="utf-8")
            has_utf8_fix = (
                "io.TextIOWrapper" in content
                or "sys.stdout.reconfigure" in content
                or "PYTHONIOENCODING" in content
            )
            has_emoji = any(ord(c) > 127 for c in content)

            if has_emoji and not has_utf8_fix:
                issues.append(str(rel))
                status = "NEEDS FIX"
            else:
                status = "OK"

            print(
                f"  {status:10s} | {str(rel):70s} | UTF-8 fix: {has_utf8_fix!s:5s} | Has emoji: {has_emoji!s}"
            )
        except Exception as e:
            issues.append(str(rel))
            print(f"  ERROR      | {str(rel):70s} | {e}")

    print(f"\n  Total Python files: {len(all_py)}")
    print(f"  Files needing UTF-8 fix: {len(issues)}")
    if issues:
        for f in issues:
            print(f"    - {f}")

    return issues


def main():
    print("\n" + "#" * 70)
    print("#  ANTIGRAVITY KIT - FULL SKILLS & AGENTS AUDIT")
    print("#" * 70)

    skill_results = audit_skills()
    agent_results = audit_agents()
    encoding_issues = audit_scripts_encoding()

    # Summary
    print("\n" + "=" * 70)
    print("  FINAL SUMMARY")
    print("=" * 70)

    skills_ok = sum(1 for r in skill_results if r["status"] == "OK")
    agents_ok = sum(1 for r in agent_results if r["status"] == "OK")

    print(f"  Skills:  {skills_ok}/{len(skill_results)} OK")
    print(f"  Agents:  {agents_ok}/{len(agent_results)} OK")
    print(f"  Encoding issues: {len(encoding_issues)} files need fix")

    if (
        not encoding_issues
        and skills_ok == len(skill_results)
        and agents_ok == len(agent_results)
    ):
        print("\n  ALL CHECKS PASSED!")
    else:
        print("\n  Some issues found. See details above.")


if __name__ == "__main__":
    main()
