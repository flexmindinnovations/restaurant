#!/usr/bin/env python3
"""Generate DOSA paper-grain tiles (seamless, fine, low-variance).

Deterministic (fixed seed) so regenerated files are byte-stable.
  python3 -I packages/brand-assets/scripts/generate-grain.py
Requires: numpy, Pillow.
"""
from pathlib import Path
import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "textures"
SIZE = 256


def wrap_blur(a: np.ndarray, sigma: float) -> np.ndarray:
    """Gaussian blur via FFT: inherently periodic, so the tile stays seamless."""
    fy = np.fft.fftfreq(a.shape[0])[:, None]
    fx = np.fft.fftfreq(a.shape[1])[None, :]
    kernel = np.exp(-2 * (np.pi ** 2) * (sigma ** 2) * (fx ** 2 + fy ** 2))
    return np.real(np.fft.ifft2(np.fft.fft2(a) * kernel))


def make(seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    fine = wrap_blur(rng.standard_normal((SIZE, SIZE)), 0.55)        # paper tooth (~1px)
    fibre = wrap_blur(rng.standard_normal((SIZE, SIZE)), 2.2) * 0.35  # soft fibre variation
    n = fine / fine.std() + fibre / max(fibre.std(), 1e-9) * 0.35
    n = n / n.std()
    # Clip at 2.5 sigma: no isolated dark specks ("dirt").
    n = np.clip(n, -2.5, 2.5) / 2.5
    return n  # -1..1, zero mean


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    n = make(20261123)
    # Neutral grey tile for blend-mode use (multiply / soft-light), mean 128.
    grey = np.clip(128 + n * 96, 0, 255).astype(np.uint8)
    Image.fromarray(grey, "L").save(OUT / "paper-grain-256.png", optimize=True)
    # Alpha-only variants: ink specks for light surfaces, pearl specks for dark (no blend mode needed).
    a = np.clip(np.abs(n) ** 1.2 * 255, 0, 255).astype(np.uint8)
    dark = np.zeros((SIZE, SIZE, 4), np.uint8); dark[..., 0:3] = (32, 32, 57); dark[..., 3] = np.where(n < 0, a, 0)
    light = np.zeros((SIZE, SIZE, 4), np.uint8); light[..., 0:3] = (247, 245, 240); light[..., 3] = np.where(n > 0, a, 0)
    Image.fromarray(dark, "RGBA").save(OUT / "paper-grain-ink-256.png", optimize=True)
    Image.fromarray(light, "RGBA").save(OUT / "paper-grain-pearl-256.png", optimize=True)
    # WebP delivery copies (smaller). Lossy is safe for the grey tile at this intensity; alpha tiles stay lossless.
    Image.open(OUT / "paper-grain-256.png").save(OUT / "paper-grain-256.webp", quality=82, method=6)
    for name in ("paper-grain-ink-256", "paper-grain-pearl-256"):
        Image.open(OUT / f"{name}.png").save(OUT / f"{name}.webp", lossless=True, method=6)
    # Seam check: wrap-around differences must match interior differences.
    g = grey.astype(float)
    seam = np.abs(g[:, 0] - g[:, -1]).mean() + np.abs(g[0, :] - g[-1, :]).mean()
    inner = np.abs(g[:, 1] - g[:, 0]).mean() + np.abs(g[1, :] - g[0, :]).mean()
    print(f"seam diff {seam:.2f} vs interior {inner:.2f} (ratio {seam / inner:.2f}, ~1.0 = seamless)")


if __name__ == "__main__":
    main()
