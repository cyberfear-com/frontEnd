"""Generate public/css/dark-theme.css for the Mailum mailbox from temp-style.css + compose.css.
Run after changing those files or dark-polish.css:  python3 tools/dark-theme/gen-dark-css.py
Every colour-bearing rule is re-emitted under html.dark-theme with the light palette mapped to the
Figma dark tokens; dark icon URLs are pointed at -white variants (generated when missing).
Then tools/dark-polish.css (hand-written) is appended."""
import re, os, sys
TOOLS = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(TOOLS, "..", ".."))
IMG = os.path.join(REPO, "public/images")

BASE, SURF, SURF2, LINE, LINE2, ACC, ACC2 = "#111315", "#1f2124", "#242729", "#222426", "#292b2e", "#3485ff", "#4992ff"
W = lambda a: "rgba(255, 255, 255, %s)" % a
BG = {"#fff": BASE, "#ffffff": BASE, "white": BASE, "#f8fafe": BASE, "#fbfbfc": "#161819", "#f9f9f9": "#161819", "#fafafa": "#161819",
      "#f2f2f2": SURF, "#f4f5f6": SURF, "#f5f6f7": SURF, "#f6f6f6": SURF, "#f1f4f9": SURF, "#eef2f9": SURF, "#eaeff8": SURF, "#f1f6fd": SURF, "#f1f6ff": SURF, "#f7f7f8": SURF, "#f0f0f0": SURF, "#f3f3f3": SURF,
      "#eee": SURF2, "#eeeeee": SURF2, "#e4e4e4": SURF2, "#e9ecef": SURF2, "#ddd": LINE2, "#dddddd": LINE2, "#ccc": "#33363a", "#cccccc": "#33363a", "#d4d7db": "#33363a", "#c8d3e6": "#33363a",
      "#2277f6": ACC, "#2377f7": ACC, "#347ae2": ACC, "#0d6efd": ACC, "#06c": ACC, "#0066cc": ACC, "#5897fb": ACC, "#0b4db0": "#2a6fd9", "#00112c": "#2a6fd9",
      "#080d13": "#2c2f33", "#000": "#2c2f33", "#000000": "#2c2f33", "black": "#2c2f33", "#22282f": "#2c2f33", "#212529": "#2c2f33",
      "#f05e30": "#cc5935", "#ea6666": "#f46053", "#f37d58": "#e2825c", "#fff3cd": "#2a2412", "#ffecb5": "#4d4220", "#dbe8fa": "#6f6cf6", "#f4f0ff": "#2b2140", "#e8f0fe": SURF, "#eceff3": BASE}
TX = {"#080d13": "#ffffff", "#000": "#ffffff", "#000000": "#ffffff", "black": "#ffffff", "#00112c": "#ffffff", "#111": "#ffffff", "#111111": "#ffffff", "#212529": "#ffffff", "#222": "#ffffff", "#22282f": "#ffffff", "#333": "#ffffff", "#333333": "#ffffff",
      "#415067": W(0.6), "#444": W(0.8), "#444444": W(0.8), "#555": W(0.7), "#6a676e": W(0.6), "#666": W(0.6), "#666666": W(0.6), "#777": W(0.5), "#888": W(0.5), "#888888": W(0.5), "#999": W(0.4), "#999999": W(0.4), "#aaa": W(0.4), "#aaaaaa": W(0.4), "#bbb": W(0.35), "#ccc": W(0.3), "#cccccc": W(0.3), "#7c8797": W(0.5), "#8a94a3": W(0.5), "#6c757d": W(0.5), "#adb5bd": W(0.4), "#c9d0da": W(0.4),
      "#2277f6": ACC, "#2377f7": ACC, "#347ae2": ACC2, "#0d6efd": ACC, "#06c": ACC, "#0066cc": ACC, "#0b4db0": "#5c9dff", "#f05e30": "#f46053", "#ea6666": "#f46053", "#664d03": "#f1d98a", "#dbe8fa": "#6f6cf6"}
BD = {"#fff": BASE, "#ffffff": BASE, "white": BASE, "#f2f2f2": LINE2, "#f4f5f6": LINE2, "#f5f6f7": LINE2, "#f6f6f6": LINE2, "#f7f7f8": LINE, "#eef2f9": LINE2, "#eaeff8": LINE2, "#f1f4f9": LINE2, "#eee": LINE2, "#eeeeee": LINE2, "#e4e4e4": LINE2, "#e9ecef": LINE2, "#ddd": LINE2, "#dddddd": LINE2, "#ccc": "#33363a", "#cccccc": "#33363a", "#ced4da": "#33363a", "#aaa": "#3a3d42", "#999": "#3a3d42", "#dee2e6": LINE2,
      "#080d13": "#ffffff", "#000": "#ffffff", "#000000": "#ffffff", "black": "#ffffff", "#22282f": "#ffffff", "#2277f6": ACC, "#2377f7": ACC, "#0d6efd": ACC, "#347ae2": ACC, "#ffecb5": "#4d4220", "#415067": W(0.6), "#0b4db0": "#2a6fd9"}
ICON_SPECIAL = {"icon-down-arrow-black.svg": "icon-down-arrow-white.svg", "icon-plus-black.svg": "icon-plus-white.svg", "storage-bar.svg": "storage-bar-dark.svg",
                "down-arrow-dark.svg": "down-arrow.svg", "icon-arrow-down.svg": "icon-arrow-down-white.svg", "icon-close-2.svg": "icon-close-2-white.svg"}
KEEP_SUFFIX = ("-white.svg", "-hover.svg", "-blue.svg", "-green.svg", "-gray.svg", "-dark.svg", "-full.svg")
generated_icons = []

def make_white(src, dst):
    s = open(src).read()
    def dark(h):
        h = h.lstrip("#");
        if len(h) == 3: h = "".join(c * 2 for c in h)
        try: r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        except ValueError: return False
        return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140
    out = re.sub(r'(fill|stroke)(="|:\s*)(#[0-9a-fA-F]{3,6})', lambda m: m.group(1) + m.group(2) + ("#ffffff" if dark(m.group(3)) else m.group(3)), s)
    if out == s: return False
    open(dst, "w").write(out); return True

def map_icon(m):
    name = m.group(2)
    if not name.endswith(".svg") or name.endswith(KEEP_SUFFIX): return m.group(0)
    if name in ICON_SPECIAL: new = ICON_SPECIAL[name]
    elif name.startswith("icon-"): new = name[:-4] + "-white.svg"
    else: return m.group(0)
    if not os.path.exists(os.path.join(IMG, new)):
        src = os.path.join(IMG, name)
        if os.path.exists(src) and make_white(src, os.path.join(IMG, new)): generated_icons.append(new)
        else: return m.group(0)
    return m.group(1) + new + m.group(3)

HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\b(?:white|black)\b", re.I)
def map_colour(tok, table):
    t = tok.lower()
    if t in table: return table[t]
    L = lum(t) if t.startswith("#") else None
    if L is not None:
        if table is BG: return BASE if L >= 0.97 else (SURF if L >= 0.82 else tok)
        if table is TX: return "#ffffff" if L <= 0.22 else (W(0.6) if L <= 0.45 else tok)
        if table is BD: return LINE2 if L >= 0.8 else tok
    m = re.match(r"rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)", t)
    if m:
        r, g, b, a = int(m.group(1)), int(m.group(2)), int(m.group(3)), m.group(4)
        if a is not None and a.endswith("%"): a = str(float(a[:-1]) / 100)
        # a black veil (overlay / backdrop) stays black; only faint black tints become white tints
        if (r, g, b) == (0, 0, 0) and a is not None:
            # a black veil (overlay / backdrop) stays black; black text, borders and faint tints become white
            return tok if (table is BG and float(a) >= 0.3) else ("rgba(255, 255, 255, %s)" % a)
        if a is None:  # opaque rgb(): same fallback as an opaque hex
            return map_colour("#%02x%02x%02x" % (r, g, b), table)
        if (r, g, b) == (255, 255, 255) and a is not None: return "rgba(17, 19, 21, %s)" % a
        if (r, g, b) == (34, 119, 246) and a is not None: return "rgba(52, 133, 255, %s)" % a
        if (r, g, b) == (147, 186, 240): return "rgba(255, 255, 255, 0.1)"
        if (r, g, b) == (8, 13, 19) and a is not None: return "rgba(255, 255, 255, %s)" % a
        if (r, g, b) == (65, 80, 103) and a is not None: return "rgba(255, 255, 255, %s)" % a   # #415067 text tints
        if (r, g, b) in ((212, 156, 255),): return tok
    return tok

def lum(tok):
    h = tok.lstrip("#")
    if len(h) == 3: h = "".join(c * 2 for c in h)
    if len(h) not in (6, 8): return None
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

def with_urls_masked(val, fn):
    urls = []
    masked = re.sub(r"url\([^)]*\)", lambda m: (urls.append(m.group(0)), "\x00URL%d\x00" % (len(urls) - 1))[1], val)
    out = fn(masked)
    return re.sub(r"\x00URL(\d+)\x00", lambda m: urls[int(m.group(1))], out)

def is_colour_prop(prop, val):
    p = prop.lower()
    return (p in ("background", "background-color", "background-image", "color", "caret-color", "fill", "stroke") or p.startswith("border") or p.startswith("outline")) and bool(HEX.search(val) or "url(" in val or re.search(r"\b(transparent|none|inherit|currentColor)\b", val) or (p == "background" and val.strip() in ("0 0", "0")))

def map_decl(prop, val):
    p = prop.lower()
    if p.startswith("box-shadow") or p == "text-shadow":
        # light shadow colours make a glow on a dark page: turn them into a soft black shadow
        def shade(m):
            tok = m.group(0); t = tok.lower()
            if t in ("#fff", "#ffffff", "white"): return BASE
            mm = re.match(r"rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)", t)
            L = lum("#%02x%02x%02x" % tuple(int(x) for x in mm.groups())) if mm else lum(t) if t.startswith("#") else None
            return "rgba(0, 0, 0, 0.45)" if L is not None and L > 0.6 else tok
        new = HEX.sub(shade, val); return new if new != val else None
    if p in ("background", "background-color", "background-image"):
        new = re.sub(r'(url\(["\']?\.\./images/)([^"\')]+)(["\']?\))', map_icon, val)
        new = with_urls_masked(new, lambda v: HEX.sub(lambda m: map_colour(m.group(0), BG), v))
        # a colour-only shorthand must not wipe an icon set by another rule: emit background-color instead
        if p == "background" and new != val and HEX.fullmatch(new.strip()):
            return ("background-color", new)
    elif p == "color" or p == "caret-color":
        new = HEX.sub(lambda m: map_colour(m.group(0), TX), val)
    elif p.startswith("border") or p.startswith("outline"):
        new = with_urls_masked(val, lambda v: HEX.sub(lambda m: map_colour(m.group(0), BD), v))
    elif p in ("fill", "stroke"):
        new = HEX.sub(lambda m: map_colour(m.group(0), TX), val)
    else: return None
    return new if new != val else None

def prefix(sel):
    sel = " ".join(sel.split())
    if sel.startswith(":root"): return "html.dark-theme" + sel[5:]
    if re.match(r"html\b", sel): return "html.dark-theme" + sel[4:]
    if re.match(r"body\b", sel): return "html.dark-theme " + sel
    return "html.dark-theme " + sel

def walk(block, media, out):
    i = 0
    while True:
        m = re.search(r"([^{}]+)\{", block[i:])
        if not m: break
        sel = m.group(1).strip(); start = i + m.end()
        if sel.startswith("@"):
            depth = 1; j = start
            while depth and j < len(block):
                if block[j] == "{": depth += 1
                elif block[j] == "}": depth -= 1
                j += 1
            if sel.startswith("@media") or sel.startswith("@supports"): walk(block[start:j - 1], sel, out)
            i = j; continue
        j = block.find("}", start); body = block[start:j]; i = j + 1
        decls = []; mapped = False
        for d in body.split(";"):
            d = d.strip()
            if ":" not in d: continue
            prop, val = d.split(":", 1); prop = prop.strip(); val = val.strip()
            imp = val.endswith("!important"); val = val[:-10].strip() if imp else val
            new = map_decl(prop, val)
            if isinstance(new, tuple): prop, new = new
            if new is not None: decls.append("%s: %s%s" % (prop, new, " !important" if imp else "")); mapped = True
            elif is_colour_prop(prop, val): decls.append("%s: %s%s" % (prop, val, " !important" if imp else ""))
        # a border / background shorthand in the twin would reset the widths / size / position that the
        # light rule sets in separate longhands: carry those longhands along
        if decls:
            props = [d.split(":", 1)[0].strip().lower() for d in decls]
            extra = []
            for d in body.split(";"):
                d = d.strip()
                if ":" not in d: continue
                pr, vl = d.split(":", 1); pr = pr.strip().lower(); vl = vl.strip()
                if pr in props: continue
                if any(x == "border" or (x.startswith("border-") and x.count("-") == 1 and not x.endswith(("color", "width", "style", "radius"))) for x in props) and (pr.startswith("border") and (pr.endswith("width") or pr.endswith("style"))):
                    extra.append("%s: %s" % (pr, vl))
                if "background" in props and pr in ("background-size", "background-position", "background-repeat", "background-origin"):
                    extra.append("%s: %s" % (pr, vl))
            decls += extra
        # every colour-bearing rule gets a twin (unchanged declarations included) so the cascade among the
        # twins mirrors the light cascade exactly and no twin can override a more specific light rule
        if decls:
            sels = ", ".join(prefix(s) for s in sel.split(","))
            out.append((media, "%s { %s; }" % (sels, "; ".join(decls))))

def generate(path):
    css = re.sub(r"/\*.*?\*/", "", open(path).read(), flags=re.S)
    out = []; walk(css, "", out); return out

sections = []
for f in ["public/css/temp-style.css", "public/css/compose.css"]:
    rules = generate(os.path.join(REPO, f))
    lines = ["/* ---- generated from %s: %d rules ---- */" % (f, len(rules))]
    cur = ""
    for media, rule in rules:
        if media != cur:
            if cur: lines.append("}")
            if media: lines.append(media + " {")
            cur = media
        lines.append(("  " if media else "") + rule)
    if cur: lines.append("}")
    sections.append("\n".join(lines))
head = "/* Mailum dark theme (Figma \"Dark Theme\" page). Generated by tools/dark-theme/gen-dark-css.py from temp-style.css and\n   compose.css with the light palette mapped to the dark tokens; the hand-written part (tools/dark-theme/dark-polish.css) is at the end. Do not edit this file by hand. */\n"
polish = open(os.path.join(TOOLS, "dark-polish.css")).read() if os.path.exists(os.path.join(TOOLS, "dark-polish.css")) else ""
open(os.path.join(REPO, "public/css/dark-theme.css"), "w").write(head + "\n".join(sections) + "\n\n/* ==== hand-written overrides (tools/dark-theme/dark-polish.css) ==== */\n" + polish)
print("generated icons:", generated_icons)
print("size", os.path.getsize(os.path.join(REPO, "public/css/dark-theme.css")))
