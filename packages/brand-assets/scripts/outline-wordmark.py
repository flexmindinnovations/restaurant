#!/usr/bin/env python3
"""Outline the DOSA wordmark from Plus Jakarta Sans (OFL 1.1) at wght 800, +4% tracking.

Writes scripts/wordmark-path.json, consumed by generate-svg.mjs. Run once when the wordmark changes:
  python3 -I packages/brand-assets/scripts/outline-wordmark.py
OFL FAQ: using the font's outlines to create a logo is permitted; the logo is not Font Software.
"""
import json, re
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = Path(__file__).resolve().parent
font = instantiateVariableFont(TTFont(HERE.parent / "fonts/plus-jakarta-sans/PlusJakartaSansVariable.ttf"), {"wght": 800})
gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
TRACK = 0.04 * font["head"].unitsPerEm
x, paths, bounds = 0.0, [], []
for ch in "DOSA":
    g = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
    d = re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.1f}".rstrip("0").rstrip("."), pen.getCommands())
    paths.append({"char": ch, "d": d})
    b = BoundsPen(gs); gs[g].draw(b); bounds.append((b.bounds[0] + x, b.bounds[1], b.bounds[2] + x, b.bounds[3]))
    x += hmtx[g][0] + TRACK
box = [min(b[0] for b in bounds), -max(b[3] for b in bounds), max(b[2] for b in bounds), -min(b[1] for b in bounds)]
(HERE / "wordmark-path.json").write_text(json.dumps({"source": "Plus Jakarta Sans 2.071 wght 800, tracking +4%", "box": box, "glyphs": paths}, indent=1))
print("box", box)
