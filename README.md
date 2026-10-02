# AdAnalytix

Web aplikacija za analizu podataka digitalnog marketinga — praćenje kampanja, klikova, budžeta, prihoda i ROI-a kroz dashboard, analitiku i izvještaje.

## Tehnologije

- **Vue 3** (`<script setup>`) — frontend framework
- **Vue Router** — navigacija i zaštita ruta (login/logout)
- **Pinia** — globalno stanje (autentikacija, kampanje)
- **Chart.js** / **vue-chartjs** — grafovi
- **Bootstrap 5** + custom CSS — izgled
- **Vite** — dev server i build

## Arhitektura: bez backenda

Ovo je frontend-only aplikacija — nema servera ni baze podataka. Svi podaci (korisnici, kampanje, postavke) spremaju se u **localStorage preglednika**, preko Pinia store-ova (`src/stores/auth.js`, `src/stores/campaign.js`).

To znači:

- Podaci ostaju spremljeni dok se ne obrišu podaci stranice u pregledniku, u istom pregledniku i na istom URL-u (portu).
- Podaci se **ne dijele** između različitih preglednika, uređaja ili portova — svaki je zaseban.
- Lozinke se spremaju kao obični tekst (bez hashiranja) — prihvatljivo za demo/edukativni projekt, ali ne bi smjelo ići u produkciju s pravim korisnicima.

Ova arhitektura je namjerno jednostavna: dovoljna je za prikaz frontend logike, izračuna metrika i vizualizacije podataka, bez dodatne kompleksnosti servera, autentikacije na backendu i baze podataka.

## Pokretanje

```bash
npm install
npm run dev       # dev server na http://localhost:5173
npm run build     # produkcijski build u dist/
npm run preview   # pregled build-a
```

## Struktura projekta

```
src/
  components/       # ponovno koristive komponente (grafovi, StatCard, modal, layout)
  views/            # stranice (Splash, Dashboard, Campaigns, Analytics, Reports, Settings, Profile, Login, Register)
  stores/           # Pinia store-ovi (auth, campaign) — čitaju/pišu u localStorage
  router/           # rute i auth guard
  composables/      # useTheme (dark mode), useChartColors (boje grafova ovisno o temi)
  utils/metrics.js  # zajedničke formule (ROI, CTR, CPC, CPA, formatiranje valute)
  utils/download.js # helper za preuzimanje JSON/CSV datoteka iz preglednika
  chart-setup.js    # jedna registracija Chart.js elemenata za sve grafove
```

## Funkcionalnosti

- Uvodni (splash) zaslon jednom po sesiji — preskače se nakon 5 s, klikom ili pritiskom tipke
- Registracija / prijava (localStorage, bez pravog backenda), email nije osjetljiv na velika/mala slova
- CRUD kampanja (naziv, platforma, budžet, prihod, klikovi, impresije, konverzije)
- Izvoz kampanja u CSV (Campaigns stranica)
- Export/Import cijelog backupa podataka kao JSON datoteka (Settings → Data) — rješava gubitak podataka ako se obriše localStorage
- Dashboard s KPI karticama i grafovima (klikovi po kampanji, platforme, kumulativni prihod)
- Analytics — detaljna tablica metrika po kampanji (CTR, CPC, CPA, ROI), filter po datumskom rasponu, graf usporedbe platformi po prosječnom ROI-u, automatsko osvježavanje
- Reports — sažetak, automatske preporuke, rangiranje kampanja po ROI-u
- Stvarne notifikacije u navbaru (upozorenja na kampanje s negativnim ROI-em ili niskim CTR-om, izvedeno iz stvarnih podataka)
- Dark mode (Settings → Dashboard Preferences), prati se kroz cijelu aplikaciju uključujući grafove
- Postavke — uključi/isključi preporuke, automatsko osvježavanje, tamnu temu
- Profil korisnika s statistikom i "performance" ocjenom
