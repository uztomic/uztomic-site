# Uztomic — rasmiy sayt (uztomic.uz)

Qoʻqondagi Uztomic jamoasi uchun bir sahifali kompaniya sayti. Qorongʻi/yorugʻ rejim, uch til (EN / UZ / RU),
buyurtma formasi va narxlar boʻlimi. **Server, maʼlumotlar bazasi yoki oylik toʻlov kerak emas** — oddiy statik sayt.

- Birinchi kirganda: **brauzer tili** boʻyicha til tanlanadi (uz/ru boʻlsa oʻsha, aks holda inglizcha)
- Mavzu (dark/light) ham birinchi kirganda **tizim sozlamasi** boʻyicha tanlanadi
- Foydalanuvchi oʻzi tanlagan til va rejim brauzerda saqlanadi
- `uztomic.uz/?lang=uz` yoki `?lang=ru` — toʻgʻridan-toʻgʻri kerakli tilda ochiladigan havola

---

## 1. Fayllar

```
index.html            — butun sayt (HTML + CSS + JS bitta faylda)
404.html              — topilmagan sahifa (brend uslubida)
CNAME                 — GitHub Pages uchun domen: uztomic.uz
.nojekyll             — GitHub Pages Jekyll’ni oʻtkazib yuborsin
robots.txt            — qidiruv robotlari uchun
sitemap.xml           — Google uchun sahifalar roʻyxati
site.webmanifest      — telefonga "ilova" sifatida qoʻshish uchun
favicon.ico           — brauzer yorligʻi (16/32/48 px)
assets/
  uztomic-logo-light.png / -dark.png   — toʻliq logo (oq / qora)
  uztomic-mark-light.png / -dark.png   — faqat "U" belgisi (menyu uchun)
  favicon-16/32/48-512.png, icon-192.png, apple-touch-icon.png
  favicon.ico
  og.jpg                                — Telegram/Facebook’da havola ulashilganda chiqadigan rasm
```

Barcha ikonkalar va OG rasm sizning logotipingizdan avtomatik yasalgan. Rejim almashganda logo oʻzi almashadi.

---

## 2. ⚠️ Sayt ishga tushishidan oldin BITTA ish qilishingiz kerak

Buyurtma formasi hozircha xat **yubormaydi**. Uni ishga tushirish uchun:

1. [web3forms.com](https://web3forms.com) ga kiring → pochtangizni (`uztomic@gmail.com`) yozing → **Create Access Key**
2. Pochtangizga kelgan kalitni nusxalang
3. `index.html` ni oching, `WEB3FORMS_KEY` qatorini toping (`<script>` boshida) va kalitni qoʻying:

```js
const WEB3FORMS_KEY = "bu-yerga-kalitni-qoying";
```

Bepul rejada oyiga **250 ta xabar** — boshlash uchun yetarli.

> Kalit qoʻyilmasa ham sayt buzilmaydi: forma yuborilganda foydalanuvchiga
> "toʻgʻridan-toʻgʻri yozing" deb Telegram va email havolasi koʻrsatiladi.
> Lekin sizga xat kelmaydi — shuning uchun kalitni albatta qoʻying.

---

## 3. Bepul hosting: GitHub Pages

**a)** GitHub’da yangi **public** repo oching (masalan `uztomic-site`). Public boʻlishi shart — bepul Pages faqat public repo’da.

**b)** Fayllarni yuklang:

```bash
cd "shu papka"
git init
git add .
git commit -m "Uztomic website"
git branch -M main
git remote add origin https://github.com/FOYDALANUVCHI/uztomic-site.git
git push -u origin main
```

Yoki brauzerdan: **Add file → Upload files** (`assets` papkasini ham, `.nojekyll` faylini ham unutmang).

**c)** Repo → **Settings → Pages** → *Deploy from a branch* → **main** / **/(root)** → Save

**d)** Xuddi shu yerda **Custom domain**: `uztomic.uz` → Save → keyin **Enforce HTTPS** ni belgilang
(sertifikat chiqishi uchun DNS tarqalgandan keyin 10–60 daqiqa kutish kerak boʻlishi mumkin)

**e)** DNS yozuvlari — domen registratori panelida (uztomic.uz sotib olgan joyingizda):

| Turi | Nomi | Qiymati |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | FOYDALANUVCHI.github.io |

`FOYDALANUVCHI` — sizning GitHub username’ingiz. DNS 15 daqiqadan 24 soatgacha tarqaladi.

**Muqobil bepul variantlar:** Cloudflare Pages (Oʻzbekistonda odatda tezroq ochiladi), Netlify, Vercel.
Ularda ham shu papkani yuklab, custom domain sifatida `uztomic.uz` ni koʻrsatasiz.

---

## 4. Aloqa maʼlumotlari (allaqachon kiritilgan)

| Nima | Hozirgi qiymat |
|---|---|
| Telefon | `+998 77 016 59 63` (bosilganda telefon oʻzi teradi) |
| Telegram | `@uztomic_official` |
| Email | `uztomic@gmail.com` |
| Ish vaqti | Har kuni, 9:00–22:00 |
| Manzil | Qoʻqon, Fargʻona viloyati |

Telefon raqami faylda ikki koʻrinishda yozilgan — oʻzgartirsangiz **ikkalasini ham** almashtiring:
`tel:+998770165963` (havola uchun) va `+998 77 016 59 63` (koʻrinish uchun).

### Narxlar

| Paket | Narx |
|---|---|
| Boshlangʻich (sayt) | 1 000 000 soʻmdan |
| Biznes (mobil ilova / platforma) | 3 000 000 soʻmdan |
| Korporativ | Kelishuv asosida |

Oʻzgartirish uchun `index.html` da qidiring — narx **uch tilda uch joyda** yozilgan:
- Inglizcha: `1 000 000 UZS`, `3 000 000 UZS`
- Oʻzbekcha: `"pr.1p":"1 000 000 soʻm"`, `"pr.2p":"3 000 000 soʻm"`
- Ruscha: `"pr.1p":"1 000 000 сум"`, `"pr.2p":"3 000 000 сум"`

Formadagi byudjet tugmalari `fm.b1` … `fm.b5` kalitlari orqali uch tilda yoziladi.

### Yana tekshiring

- **Stats** boʻlimidagi `5+`, `6`, `24h`, `3` raqamlari — rost boʻlsin
- **Ishlarimiz** boʻlimidagi uchta loyiha
- **FAQ** javoblaridagi muddat va kafolat shartlari
- FAQ matnini oʻzgartirsangiz, `<head>` dagi **FAQPage** JSON-LD ni ham yangilang (Google shu yerdan oʻqiydi)

---

## 5. Sozlash boʻyicha maslahatlar

**Boshlangʻich tilni majburan oʻzbekcha qilish** — skript oxiridagi brauzer tilini aniqlash blokini olib tashlab,
`let saved = ...` oʻrniga `let saved = 'uz';` yozing.

**Boshlangʻich rejimni majburan yorugʻ qilish:** `<head>` dagi kichik skriptda
`matchMedia(...)matches?'light':'dark'` ni `'light'` ga almashtiring.

**Ranglarni oʻzgartirish:** CSS boshidagi `:root` blokida `--violet`, `--cyan`, `--coral`
qiymatlarini almashtirsangiz, butun sayt boʻylab rang oʻzgaradi.

**Yangi loyiha qoʻshish:** "Work" boʻlimidagi bitta `<article class="wk rv">` blokini
nusxalang, matnini oʻzgartiring, RU/UZ tarjimasini `I18N` ichiga `wk.4.*` kalitlari bilan qoʻshing.

**Logoni almashtirsangiz** ikonkalarni ham qayta yasash kerak (`assets/` dagi favicon-*.png, og.jpg).

---

## 6. Google’ga qoʻshish

1. [search.google.com/search-console](https://search.google.com/search-console) → `uztomic.uz` ni qoʻshing
2. `https://uztomic.uz/sitemap.xml` ni yuboring
3. **Google Business Profile** da kompaniyani roʻyxatdan oʻtkazing — Qoʻqon boʻyicha mahalliy qidiruvda eng koʻp yordam beradi

---

## 7. Saytni kompyuterda tekshirish

Faylni oddiy ikki marta bosib ham ochsa boʻladi, lekin manifest va ikonkalar toʻgʻri koʻrinishi uchun
kichik server orqali ochish maʼqul:

```bash
npx serve .          # keyin http://localhost:3000
```
