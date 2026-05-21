"""Remove grey background and export emblem + tagline assets."""
from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\jvachon\.cursor\projects\c-xampp-htdocs-aicoachingsite\assets"
    r"\c__Users_jvachon_AppData_Roaming_Cursor_User_workspaceStorage_c9bf0d9f6192b7830000ed4337457447_images"
    r"_ChatGPT_Image_May_15__2026__08_56_04_AM-33a5bfe8-5750-4835-82ea-f8e618f58de6.png"
)
OUT = Path(__file__).resolve().parent.parent / "assets" / "images"


def is_background(r: int, g: int, b: int, a: int = 255) -> bool:
    if a < 20:
        return True
    avg = (r + g + b) / 3
    spread = max(r, g, b) - min(r, g, b)
    # Charcoal matte, vignette, and light speckle on edges
    if spread < 42 and 30 < avg < 130:
        return True
    if spread < 28 and avg < 155:
        return True
    # Desaturated grey fringe
    if spread < 50 and 80 < avg < 175 and abs(r - g) < 30 and abs(g - b) < 30:
        return True
    return False


def remove_bg(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background(r, g, b, a):
                px[x, y] = (0, 0, 0, 0)
            elif spread := (max(r, g, b) - min(r, g, b)) < 55:
                avg = (r + g + b) / 3
                if 50 < avg < 140:
                    # Semi-transparent edge cleanup
                    px[x, y] = (r, g, b, min(a, 180))
    return im


def clean_alpha(im: Image.Image) -> Image.Image:
    """Drop low-alpha grey halos."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 64:
                px[x, y] = (0, 0, 0, 0)
            elif a < 200:
                avg = (r + g + b) / 3
                is_gold = r > 140 and g > 110 and b < 120
                if not is_gold and max(r, g, b) - min(r, g, b) < 40 and avg > 45:
                    px[x, y] = (r, g, b, 0)
    return im


def pad_image(im: Image.Image, top: int = 0, right: int = 0, bottom: int = 0, left: int = 0) -> Image.Image:
    nw = im.width + left + right
    nh = im.height + top + bottom
    out = Image.new("RGBA", (nw, nh), (0, 0, 0, 0))
    out.paste(im, (left, top), im)
    return out


def brighten_gold_pixels(im: Image.Image) -> Image.Image:
    """Push emblem gold toward brighter championship yellow."""
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 16:
                continue
            if r > 120 and g > 90 and b < 130 and r >= g * 0.85:
                r = min(255, int(r * 1.08 + 18))
                g = min(255, int(g * 1.1 + 22))
                b = max(0, int(b * 0.85))
                px[x, y] = (r, g, b, a)
    return im


def bbox_non_transparent(im: Image.Image, pad: int = 8) -> tuple[int, int, int, int]:
    alpha = im.split()[-1]
    box = alpha.getbbox()
    if not box:
        return (0, 0, im.width, im.height)
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(im.width, x1 + pad),
        min(im.height, y1 + pad),
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC)
    cleaned = clean_alpha(remove_bg(src))
    box = bbox_non_transparent(cleaned, pad=12)
    cleaned = cleaned.crop(box)
    w, h = cleaned.size

    # Emblem: full circular crest (include complete outer ring)
    emblem_h = int(h * 0.78)
    emblem = cleaned.crop((0, 0, w, emblem_h))
    emblem_box = bbox_non_transparent(emblem, pad=36)
    emblem = brighten_gold_pixels(emblem.crop(emblem_box))
    emblem = pad_image(emblem, top=6, bottom=14, left=6, right=6)

    # Tagline band: bottom ~14% (gold AI COACHING SOLUTIONS)
    tag_y0 = int(h * 0.86)
    tagline = cleaned.crop((0, tag_y0, w, h))
    tag_box = bbox_non_transparent(tagline, pad=4)
    tagline = tagline.crop(tag_box)

    emblem.save(OUT / "coach-v-emblem.png", optimize=True)
    tagline.save(OUT / "coach-v-tagline.png", optimize=True)

    # Combined lockup for footer / single img use
    combined_h = emblem.height + tagline.height + 12
    combined = Image.new("RGBA", (max(emblem.width, tagline.width), combined_h), (0, 0, 0, 0))
    ex = (combined.width - emblem.width) // 2
    combined.paste(emblem, (ex, 0), emblem)
    tx = (combined.width - tagline.width) // 2
    combined.paste(tagline, (tx, emblem.height + 12), tagline)
    combined.save(OUT / "coach-v-logo.png", optimize=True)

    print("Wrote:", OUT / "coach-v-emblem.png")
    print("Wrote:", OUT / "coach-v-tagline.png")
    print("Wrote:", OUT / "coach-v-logo.png")


if __name__ == "__main__":
    main()
