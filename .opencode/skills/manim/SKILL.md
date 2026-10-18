---
name: manim-animation
description: Skill rules for generating mathematical, data, and geometric animations using Manim.
opencode/slash: true
---

# Manim Animation Expert

## Context
Use this skill when tasked with creating programmatic motion graphics, math animations, geometric visuals, or kinetic typography using the Manim Python library.

## Instructions
1. Always write clean, object-oriented Manim code inside a class inheriting from `Scene`.
2. Ensure math formulas use correct LaTeX notation formatting.
3. Keep animations fluid by grouping compound animations using `self.play(AnimationGroup(...))`.
4. Render quick, low-resolution previews using `manim -pql file.py SceneName` before executing high-definition renders.
