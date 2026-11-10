# Card deck + scrapbook stickers

Full-screen cards swing up and stack one by one as you scroll, over a huge headline word, with optional stickers and GIFs popping in around them. Cards come from a blog. Includes the fix that centres the cards below the header.

### Content
- **Cards:** a blog (e.g. `/offerings`). Title = card heading, excerpt = card text, thumbnail = card image, first tag = button text, Source URL = button link.
- **Stickers:** a second blog (e.g. `/stickers`), one image per post. Tag a post `photo` for a taped-photo look, or `front` to sit above the cards.

### Settings
| Setting | What it does |
|---|---|
| `data-collection` | Blog for the cards |
| `data-scatter` | Blog for the stickers |
| `data-buttons` | Button style(s): `primary`, `secondary`, `tertiary`, cycles per card |
| `data-card-colors` / `data-card-text-colors` | Colours per card, comma separated |
| `data-glow`, `data-glow-color`, `data-glow-strength`, `data-glow-size` | Glow on the top card |
| `data-cover` | `on` = the sections below rise up over the deck |
| `data-mobile-image` / `data-mobile-text` | Image height and text scale on mobile |
| `data-font-name`, `data-font-url`, `data-font-weight` | Font for the big headline word |
| `<h2>` inside, or `data-headline` | The headline word |

Headline colour: `data-headline-color`. Nudge the cards down: `data-nudge="20"` (px). Tilt: `TILT` and `REST` at the top of the script.

### Install

Paste into **Settings → Developer tools → Code injection → Footer**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sq-assets/card-deck@main/effect.css">
<script src="https://cdn.jsdelivr.net/gh/sq-assets/card-deck@main/effect.js"></script>
```

After changing a file here, jsDelivr can take up to 12 hours to update the live site. To force it straight away, purge it at https://www.jsdelivr.com/tools/purge

### Code Block

```html
<div class="deck"
  data-collection="/offerings"
  data-scatter="/stickers"
  data-buttons="primary"
  data-glow="on"
  data-glow-color="#ED6A5E"
  data-glow-strength="1"
  data-glow-size="25"
  data-cover="on"
  data-mobile-image="16"
  data-mobile-text="1"
  data-font-name="Coo and Miku"
  data-font-url="https://static1.squarespace.com/static/6ad0cd06bdf579679cd29712/t/6ae369a254cf1d5e365c02b1/1793288610581/CooandMiku-Normal.otf"
  data-font-weight="400">
  <h2>LETS GO</h2>
</div>
```

Made by [Kill Vanilla Studio](https://www.killvanillastudio.com)
