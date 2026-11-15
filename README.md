# Welleast Studio — Shoe Sales MVP

- `site/` — static storefront (GitHub Pages). **Edit `site/products.json`** to change prices, sizes, stock, and the order email.
- `profit_plan.md` — 利润最大化方案（B2B + B2C，7/30/90 天行动）
- `listing_checklist.md` — 各平台上架清单（图片、UPC/GTIN、品牌授权、费用）
- `nyc_footwear_importers.csv` — 纽约鞋类进口商名单（公开信息）

## Placeholders to fill (TODO)
| Field (site/products.json) | Now | Replace with |
|---|---|---|
| `store.email` | `TODO-your-email@example.com` | real inbox for orders |
| `store.formspreeId` | empty → form opens the visitor's mail app | Formspree form ID (optional) |
| `products[].price` | `null` → shows `examplePrice` labeled "Example price" | real USD price |
| `products[].sizes` | US 7–11 (example) | real size run |
| `products[].stock` | `null` (unknown) | units on hand |
| `products[].sku` | `TODO-SKU-xx` | real style/SKU |
| `store.shippingNote` | TODO | shipping & returns policy |
| Images | AI renders cropped from the showcase poster (logos removed) | real photos of the actual stock |

No payment processing. No reviews or stats are shown. Language: `?lang=zh` or the 中文 button.

## Before taking real orders
Confirm the brand / authorization status of this stock. If the goods carry or imitate another company's trademark or design, do not sell them on any channel.
