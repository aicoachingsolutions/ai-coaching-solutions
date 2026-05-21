"""Optional crop for swing-analyzer pills only. Multi-sport grid uses full photos via import-sport-photos.py."""
from pathlib import Path

from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "assets" / "images"

PILL_BALLS = ("ball-golf.png", "ball-baseball.png", "ball-softball.png")


def crop_for_pill(path: Path, size: int = 400) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    side = int(min(w, h) * 0.55)
    left = (w - side) // 2
    top = (h - side) // 2
    cropped = im.crop((left, top, left + side, top + side))
    cropped = cropped.resize((size, size), Image.Resampling.LANCZOS)
    cropped.save(path, optimize=True)
    print(path.name, size)


if __name__ == "__main__":
    print("Run import-sport-photos.py first for multi-sport cards.")
    for name in PILL_BALLS:
        p = IMAGES / name
        if p.exists():
            crop_for_pill(p)
