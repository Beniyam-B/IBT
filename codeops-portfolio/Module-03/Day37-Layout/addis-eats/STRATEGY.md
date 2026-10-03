Rendering Strategy — Addis Eats

# Rendering Strategy — Addis Eats

| Route | Strategy | Why |

 /  Static | The story and address never change between builds |
| /menu | ISR, 1 hour | Dishes change occasionally; speed matters most |
| /menu/[id] | Static via params | Every dish id is known at build time (`generateStaticParams`) |
| /cart | Client | It's the person's own state, and private |
| /checkout | Dynamic | Reads the session cookie and live pricing, can't be prebuilt |

Build output

Paste the route table from npm run build here once the fixes above are rebuilt — confirm /menu and /menu/[id] show the static marker (○) and /checkout shows the dynamic marker (ƒ).

Route (app)          Size     First Load JS
┌ ○ /
├ ○ /menu
├ ○ /menu/[id]
├ ○ /cart
└ ƒ /checkout