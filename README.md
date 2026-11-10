# Uztomic — rasmiy sayt (uztomic.uz)

> **2026-10-31 yangilanishi.** Bosh sahifa qayta yozildi: kompaniya haqida, Instagram videolari (`media/`),
> 17 ta ish, Uztomic CRM 4 tarifi va 10 yo'nalishi, narx kalkulyatori, UZ/RU.
> Hammasi bitta `index.html` da. Portfolio, videolar va kalkulyator narxlari faylning pastidagi
> `REELS`, `WORKS`, `TYPES`, `FEATS`, `SUPPORT` ro'yxatlarida — o'sha joyni tahrirlash kifoya.
> `crm/` endi `/#crm` ga yo'naltiradi (eski sahifada eski tariflar bor edi).
> Pastdagi eski hujjat avvalgi versiya uchun (`assets/ui.css`, `ui.js` endi bosh sahifada ishlatilmaydi).


Ikki sahifali statik sayt. **Server, maʼlumotlar bazasi yoki oylik toʻlov kerak emas.**

| Sahifa | Nima uchun |
|---|---|
| `uztomic.uz` | Studiya: xizmatlar, ishlar, narxlar, ariza formasi |
| `uztomic.uz/crm` | **Uztomic CRM** — doʻkonlar uchun tayyor tizim: imkoniyatlar, jonli demo, narxlar, bepul sinov |

- Uch til: **EN / UZ / RU**. Ikkala sahifa ham birinchi kirganda **oʻzbekcha** ochiladi —
  brauzer tili qasddan hisobga olinmaydi. Foydalanuvchi EN yoki RU ni bir marta tanlasa,
  tanlovi brauzerda saqlanadi va keyin oʻsha tilda ochiladi.
- Qorongʻi/yorugʻ rejim tizim sozlamasi boʻyicha tanlanadi, keyin foydalanuvchi tanlovi eslab qolinadi.
- `uztomic.uz/?lang=ru`, `uztomic.uz/crm/?lang=en` — toʻgʻridan-toʻgʻri kerakli tildagi havola.
- Brend **kirish animatsiyasi** har bir brauzer seansida **bir marta** koʻrsatiladi (~3,9 soniya),
  istalgan joyga bosib oʻtkazib yuborish mumkin.

---

## 1. Fayllar

```
index.html            — bosh sahifa (markup + shu sahifaning tarjimalari)
crm/index.html        — Uztomic CRM sahifasi
404.html              — topilmagan sahifa
assets/
  ui.css              — UMUMIY dizayn tizimi (ranglar, tugmalar, kartalar, animatsiyalar)
  ui.js               — UMUMIY skript (mavzu, tillar, animatsiya, forma, kalkulyatorlar)
  logo.png            — asosiy logotip (ulashish va manba sifatida)
  mark-dark-*.png     — brauzer yorligʻi uchun belgi (yorugʻ tizimda)
  mark-light-*.png    — xuddi shu belgi (qorongʻi tizimda)
  uztomic-logo-*.png  — toʻliq logo (oq / qora)
  uztomic-mark-*.png  — faqat "U" belgisi (menyu uchun)
  favicon-*.png, icon-192.png, apple-touch-icon.png, favicon.ico
  og.jpg              — Telegram/Facebookʼda havola ulashilganda chiqadigan rasm
animation/            — kirish animatsiyasining dizayn manbasi (saytda ishlatilmaydi, qarang §6)
CNAME .nojekyll robots.txt sitemap.xml site.webmanifest favicon.ico
```

**Muhim:** CSS va JS ikkala sahifada bitta joydan olinadi (`/assets/ui.css`, `/assets/ui.js`).
Yaʼni bitta oʻzgartirish ikkala sahifaga birdan tushadi.

---

## 2. Saytni kompyuterda ochish

Yoʻllar ildizdan yozilgan (`/assets/...`), shuning uchun faylni ikki marta bosib emas,
kichik server orqali oching:

```bash
npx serve .          # keyin http://localhost:3000
```

---

## 3. Narxlarni oʻzgartirish

Narx **uch tilda uch joyda** yozilgan. `index.html` ni oching va kalit boʻyicha qidiring —
inglizchasi markupda, oʻzbekcha va ruschasi fayl oxiridagi `window.I18N` ichida.

### Studiya paketlari (bosh sahifa)

| Paket | Kalit | Hozirgi narx |
|---|---|---|
| Landing | `pr.1p` | 2 000 000 soʻm |
| Biznes | `pr.2p` | 6 000 000 soʻm |
| Pro platforma | `pr.3p` | 12 000 000 soʻm |
| Korporativ | `pr.4p` | Kelishuv asosida |

Formadagi byudjet tugmalari — `fm.b1` … `fm.b5`.
Bosh sahifadagi **taxminiy narx kalkulyatori** raqamlari markupda turadi:
`index.html` da `name="ekind"` (asosiy narx) va `name="eadd"` (qoʻshimchalar) qatorlaridagi
`data-lo`, `data-hi`, `data-w1`, `data-w2` qiymatlari.

### CRM obunasi (`/crm`)

Saytdagi raqamlar **ilovadagi haqiqiy narxlar** bilan bir xil:

| Nima | Kalit | Narx |
|---|---|---|
| Oʻrnatish, bir marta | `c.ad.1` | 400 000 soʻm |
| Oʻrnatish + chek printeri | `c.ad.2` | 700 000 soʻm |
| Standard (6 hisob, 2 filial) | `c.pr.1p` | 150 000 soʻm / oy |
| Pro (16 hisob, 3 filial, AI) | `c.pr.2p` | 400 000 soʻm / oy |
| Qoʻshimcha filial | `c.ad.3` | +100 000 soʻm / oy |
| Qoʻshimcha 5 hisob | `c.ad.4` | +50 000 soʻm / oy |

> ⚠️ CRM sahifasidagi **kalkulyator** narxlarni `assets/ui.js` ichidagi `P` obyektidan oladi
> (`std`, `pro`, `branch`, `slot1`, `slotN` …). Bu qiymatlar Flutter ilovasidagi
> `Subscription.monthlyFor()` bilan bir xil hisoblaydi. Narxni oʻzgartirsangiz **uch joyda**
> yangilang: `assets/ui.js` dagi `P`, `crm/index.html` dagi matn, va ilova/Super Admin paneldagi
> qiymatlar. Aks holda mijoz saytda bir narx, ilovada boshqa narx koʻradi.

---

## 4. Aloqa maʼlumotlari

| Nima | Hozirgi qiymat |
|---|---|
| Aloqa shaxsi | Rahmatilloh Ganiyev |
| Telefon | `+998 77 016 59 63` |
| Telegram | `@uztomic_official` |
| Email | `uztomic@gmail.com` |
| Ish vaqti | Har kuni, 9:00–22:00 |
| Manzil | Qoʻqon, Fargʻona viloyati |

Telefon raqami ikki koʻrinishda yozilgan — oʻzgartirsangiz **ikkalasini ham** almashtiring:
`tel:+998770165963` (havola) va `+998 77 016 59 63` (koʻrinish). Bir joyda `data-copy` atributi
ham bor — kompyuterda raqamni bosganda nusxa olinadi.

**Ariza formasi** [web3forms.com](https://web3forms.com) orqali ishlaydi.
Kalit `assets/ui.js` boshida: `WEB3FORMS_KEY`. Bepul rejada oyiga 250 ta xabar.
Har bir arizada `page` maydoni ham keladi — `home` yoki `crm`, yaʼni qaysi sahifadan kelgani koʻrinadi.
Kalit ishlamasa forma buzilmaydi: foydalanuvchiga Telegram va pochta havolasi koʻrsatiladi.

---

## 5. Matn va tarjima qoʻshish

Har bir matn `data-i18n="kalit"` atributi bilan belgilangan:

- **Inglizcha** — HTMLning oʻzida (manba matn shu),
- **Oʻzbekcha va ruscha** — sahifa oxiridagi `window.I18N = { uz:{…}, ru:{…} }` ichida.

Yangi matn qoʻshsangiz, uchala tilda ham boʻlishi kerak. Tekshirish uchun brauzerda
UZ va RU ga oʻting — tarjimasiz qolgan joy inglizcha koʻrinib qoladi.

Maxsus kalitlar: `_title` (sahifa sarlavhasi), `_desc` (Google uchun tavsif),
`_ok` / `_err` / `_sending` (forma xabarlari), `_uzs` (valyuta), `_weeks` (muddat birligi).

---

## 6. Kirish animatsiyasi

Orbita halqasi logotipdagi burchakda (−18°) qotib turadi — u aylanmaydi.
Ilgari sekin aylanardi va bir necha soniyadan keyin brend burchagidan chiqib ketardi.

`animation/` papkasida animatsiyaning **dizayn manbasi** turadi (Claude Design kompozitsiyasi,
JSX + 70 KB pleyer). Saytda **u ishlatilmaydi** — oʻsha animatsiya sof SVG va CSS bilan
qaytadan yigʻilgan: `assets/ui.css` oxiridagi `INTRO` boʻlimi va sahifalardagi `<div id="intro">`.

Nima uchun shunday: kirish animatsiyasi saytning eng birinchi koʻrinadigan qismi,
shuning uchun u kutubxonasiz, bir necha kilobayt va tez ochiladigan boʻlishi kerak.

- Har bir brauzer seansida **bir marta** koʻrsatiladi (`sessionStorage`)
- Havolada `#boʻlim` boʻlsa (masalan `uztomic.uz/#pricing`) — koʻrsatilmaydi
- Foydalanuvchi harakatni kamaytirishni yoqqan boʻlsa (`prefers-reduced-motion`) — koʻrsatilmaydi
- Istalgan joyga bosish, `Esc` yoki "Websitega kirish" tugmasi — darhol oʻtkazib yuboradi
- Vaqtni CSS boshqaradi va `<head>` dagi kichik skript 3,9 soniyada uni **majburan** yopadi,
  shuning uchun skript yuklanmay qolsa ham sayt bloklanib qolmaydi

Tezlikni oʻzgartirish: `assets/ui.css` dagi `#intro` animatsiya kechikishlari
(`i-out` 3.3s dan boshlanadi) va `<head>` skriptidagi `3880` raqami — ikkalasi mos boʻlsin.

---

## 7. Bepul hosting: GitHub Pages

**a)** GitHubʼda **public** repo oching (masalan `uztomic-site`).

**b)** Fayllarni yuklang:

```bash
git add .
git commit -m "Uztomic website"
git push
```

`assets` va `crm` papkalarini hamda `.nojekyll` faylini unutmang.

**c)** Repo → **Settings → Pages** → *Deploy from a branch* → **main** / **/(root)** → Save

**d)** Shu yerda **Custom domain**: `uztomic.uz` → Save → keyin **Enforce HTTPS** ni belgilang.

**e)** DNS yozuvlari (domen sotib olgan joyingizda):

| Turi | Nomi | Qiymati |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | FOYDALANUVCHI.github.io |

**Muqobil:** Cloudflare Pages (Oʻzbekistonda odatda tezroq), Netlify, Vercel.

---

## 8. Ishga tushirishdan oldin tekshirish roʻyxati

1. Ikkala sahifa ochiladi: `/` va `/crm/`, konsolda xato yoʻq (`F12 → Console`)
2. Uch til: EN / UZ / RU — tarjimasiz matn qolmagan; ikkala sahifa ham oʻzbekcha ochiladi
3. Ikki mavzu: qorongʻi va yorugʻ, qayta yuklaganda tanlov saqlanadi
4. Kengliklar: 360, 768, 1024, 1440 px — gorizontal scroll yoʻq
5. Kirish animatsiyasi bir marta chiqadi, bosilganda yopiladi; yangi tabda yana chiqadi
6. Kalkulyatorlar: CRM ⇒ Pro + 5 filial + 20 hisob = **635 000 soʻm/oy**;
   bosh sahifa ⇒ Sayt + onlayn toʻlov + admin panel = **5 500 000 – 10 000 000 soʻm**
7. Forma: ikkala sahifadan test ariza yuboriladi, pochtaga kelgani tekshiriladi
8. Havolalar: CRMʼga olib boradigan barcha nuqtalar, telefon, Telegram, pochta, 404 sahifasi
9. Brauzer yorligʻida logotip koʻrinadi; havola Telegramʼga tashlanganda rasm chiqadi
10. Lighthouse (Chrome DevTools): Performance / SEO / Accessibility **90+**

---

## 9. Googleʼga qoʻshish

1. [search.google.com/search-console](https://search.google.com/search-console) → `uztomic.uz`
2. `https://uztomic.uz/sitemap.xml` ni yuboring (ikkala sahifa shu yerda)
3. **Google Business Profile** da kompaniyani roʻyxatdan oʻtkazing — Qoʻqon boʻyicha
   mahalliy qidiruvda eng koʻp yordam beradi

---

## 10. Tez-tez kerak boʻladigan oʻzgartirishlar

**Ranglar** — `assets/ui.css` boshidagi `:root` blokida `--brand`, `--cyan`, `--coral`.
Qorongʻi va yorugʻ rejim qiymatlari ostidagi ikki blokda.

**Yangi loyiha qoʻshish** — `index.html` dagi bitta `<article class="wk">` blokini nusxalang,
matnini oʻzgartiring va `window.I18N` ichiga `wk.4.*` kalitlari bilan tarjimasini qoʻshing.

**CRM imkoniyati qoʻshish** — `crm/index.html` dagi bitta `<article class="crd">` ni nusxalang,
`c.f13t` / `c.f13d` kalitlarini uch tilda yozing.

**Statistika raqamlari** — `index.html` da `data-count` atributlari (ekranga kelganda sanaladi).

**Brauzer yorligʻidagi ikonka** — `assets/uztomic-mark-dark.png` dan yasalgan
`favicon.ico` (16/32/48) va `assets/mark-dark-48.png`. Tizim qorongʻi rejimda boʻlsa
skript uni `mark-light-48.png` ga almashtiradi, aks holda belgi qora fonda koʻrinmasdi.

**Logotipni almashtirsangiz** — `assets/` dagi `mark-*`, `favicon.ico`, `icon-192.png`,
`apple-touch-icon.png` va `og.jpg` ni ham qayta yasash kerak.
