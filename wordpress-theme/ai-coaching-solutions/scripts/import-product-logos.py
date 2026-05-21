"""Copy Break90 and Practice Planner logos into theme assets."""
import shutil
from pathlib import Path

THEME_IMAGES = Path(__file__).resolve().parent.parent / "assets" / "images"
ASSETS = Path(
    r"C:\Users\jvachon\.cursor\projects\c-xampp-htdocs-aicoachingsite\assets"
)

THEME_IMAGES.mkdir(parents=True, exist_ok=True)

pairs = {
    "break90-logo.png": "*11_15_14*",
    "practice-planner-logo.png": "*11_24_56*",
    "swing-analyzer-logo.png": "*11_30_45*",
    "drill-library-logo.png": "*11_54_33*",
    "team-development-logo.png": "*11_57_38*",
    "future-coaching-tools-logo.png": "*12_11_45*",
    "coaching-system-logo.png": "*12_16_47*",
    "saving-time-logo.png": "*12_15_14*",
}

for dest, pattern in pairs.items():
    matches = list(ASSETS.glob(pattern))
    if not matches:
        raise FileNotFoundError(pattern)
    out = THEME_IMAGES / dest
    shutil.copy2(matches[0], out)
    print("Copied", out, out.stat().st_size, "bytes")
