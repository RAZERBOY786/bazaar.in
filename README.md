# Bazaar.in — Amazon.in-style marketplace demo

A complete front-end marketplace demo built with **React 19**, **Vite** and
**React Router**. It recreates the Amazon.in shopping experience — home,
search, category listings, product details, cart, checkout, orders, account,
wishlist, help, returns, legal pages and a 404 — using realistic sample data.

> **Demo only.** Bazaar.in is an original portfolio project. It is not
> affiliated with, endorsed by or sponsored by Amazon. The wordmark and smile
> mark are original artwork, and all photography is free-to-use stock imagery.

## Run it

```bash
npm install
npm run dev
```

Vite serves the app at the URL printed in the terminal (normally
`http://localhost:5173/`). To use the same port as the screenshots in this
project:

```bash
npm run dev -- --port 5180
```

Build and lint:

```bash
npm run build
npm run lint
```

## Demo behaviour

- **Sign in:** any email address or 10-digit mobile number, with a password of
  4 or more characters.
- **OTP:** any 6 digits.
- **Promo code:** `SAVE10` gives 10% off, capped at ₹200.
- **Persistence:** cart, wishlist, account, addresses, payments, orders and
  recently viewed items are stored in `localStorage` under
  `amazonin-clone-v1`. Clear site data to reset the demo.
- **Rufus:** the shopping assistant at `/rufus` is a local mock with canned
  replies; it does not call an external API.
- **Images:** product, category, hero, gift-card and editorial images live in
  `public/images/`. See [IMAGE_CREDITS.md](IMAGE_CREDITS.md).

## Pages

| Area | Routes |
| --- | --- |
| Home | `/` |
| Search & listings | `/search`, `/category/:slug`, `/deals`, `/bestsellers`, `/new-releases` |
| Product | `/product/:id` |
| Shopping | `/cart`, `/checkout`, `/order-confirmation/:id` |
| Account | `/orders`, `/orders/:id`, `/signin`, `/register`, `/account`, `/wishlist`, `/browsing-history`, `/buy-again` |
| Discovery | `/gift-ideas`, `/coupons`, `/gift-cards`, `/rufus` |
| Support | `/help`, `/returns` |
| Information | `/about`, `/careers`, `/sell`, `/prime`, `/privacy`, `/conditions`, `/interest-ads`, `/accessibility` |
| Fallback | `*` (404 page) |

## Accessibility

- Skip-to-content link.
- Visible focus styles.
- Keyboard shortcuts:
  - `Alt` + `/` — focus search
  - `Shift` + `Alt` + `C` — cart
  - `Shift` + `Alt` + `H` — home
  - `Shift` + `Alt` + `O` — orders
  - `Shift` + `Alt` + `Z` — toggle the shortcuts dialog
- Descriptive labels and responsive layouts from 390 px upwards.
