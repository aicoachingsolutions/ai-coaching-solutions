"""Import Coach V circle crest only (no COACH V SOLUTIONS text)."""
from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\jvachon\.cursor\projects\c-xampp-htdocs-aicoachingsite\assets"
    r"\c__Users_jvachon_AppData_Roaming_Cursor_User_workspaceStorage_c9bf0d9f6192b7830000ed4337457447_images"
    r"_ChatGPT_Image_May_20__2026__11_09_03_AM-5614a79b-a353-4a69-a991-dfe0df1f945b.png"
)
OUT = Path(__file__).resolve().parent.parent / "assets" / "images" / "coach-v-circle-logo.png"


def is_navy_bg(r: int, g: int, b: int, a: int = 255) -> bool:
    if a < 20:
        return True
    # Dark navy page background (#071426, #0b1f3a, #001529 range)
    if r < 45 and g < 55 and b < 80 and (r + g + b) < 120:
        return True
    if r < 30 and g < 40 and b < 70:
        return True
    return False


def remove_bg(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_navy_bg(r, g, b, a):
                px[x, y] = (0, 0, 0, 0)
    return im


def main() -> None:
    im = remove_bg(Image.open(SRC))
    alpha = im.split()[-1]
    box = alpha.getbbox()
    if box:
        pad = 8
        x0, y0, x1, y1 = box
        im = im.crop(
            (
                max(0, x0 - pad),
                max(0, y0 - pad),
                min(im.width, x1 + pad),
                min(im.height, y1 + pad),
            )
        )

    # Keep only the circular crest — drop COACH V / SOLUTIONS wordmark below
    w, h = im.size
    circle_h = int(h * 0.72)
    im = im.crop((0, 0, w, circle_h))
    alpha = im.split()[-1]
    circle_box = alpha.getbbox()
    if circle_box:
        cp = 20
        cx0, cy0, cx1, cy1 = circle_box
        im = im.crop(
            (
                max(0, cx0 - cp),
                max(0, cy0 - cp),
                min(im.width, cx1 + cp),
                min(im.height, cy1 + cp + 32),
            )
        )

    # Generous transparent padding (extra at bottom for outer gold ring)
    side = 14
    top = 12
    bottom = 44
    canvas = Image.new(
        "RGBA",
        (im.width + side * 2, im.height + top + bottom),
        (0, 0, 0, 0),
    )
    canvas.paste(im, (side, top), im)
    im = canvas

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, optimize=True)
    print("Wrote", OUT, im.size)


if __name__ == "__main__":
    main()
