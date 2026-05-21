"""Copy user-provided sport photos into theme assets (no crop/processing)."""
import shutil
from pathlib import Path

ASSETS = Path(
    r"C:\Users\jvachon\.cursor\projects\c-xampp-htdocs-aicoachingsite\assets"
)
OUT = Path(__file__).resolve().parent.parent / "assets" / "images"

# Original uploads from chat — glob by timestamp fragment
SPORTS = {
    "ball-golf.png": "*11_46_24*",
    "ball-baseball.png": "*11_47_10*",
    "ball-softball.png": "*11_49_05*",
    "ball-basketball.png": "*12_30_13*",
    "ball-football.png": "*12_25_53*",
    "ball-soccer.png": "*12_29_03*",
    "ball-lacrosse.png": "*12_40_05*",
    "ball-volleyball.png": "*12_32_05*",
    "ball-hockey.png": "*12_42_13*",
    "ball-track-field.png": "*12_43_43*",
}


def find_source(pattern: str) -> Path | None:
    matches = sorted(ASSETS.glob(pattern))
    return matches[0] if matches else None


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for dest_name, pattern in SPORTS.items():
        src = find_source(pattern)
        if not src:
            print("MISSING", dest_name, pattern)
            continue
        shutil.copy2(src, OUT / dest_name)
        print(dest_name, "<-", src.name, src.stat().st_size)


if __name__ == "__main__":
    main()
