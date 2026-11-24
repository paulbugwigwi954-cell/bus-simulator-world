# Safari ya Mkoani

Mchezo wa 3D wa mabasi ya mkoani. Hauhitaji build: ni faili tuli (Vercel: Framework Preset = Other).

## Faili
- `index.html` mchezo (Three.js kutoka CDN)
- `data.js` njia, vituo, mabasi (ongeza njia/basi hapa)
- `vehicles.js` mabasi na magari ya barabarani (yanajengwa kwa msimbo)
- `supabase.js` + `config.js` leaderboard
- `supabase/schema.sql` jedwali la `scores` na RLS

## Njia
Dar–Dodoma, Nairobi–Mombasa, Kampala–Mbale, Arusha–Nairobi (mpaka wa Namanga).
Kituo chenye `'border'` kama kipengee cha tatu ni mpaka: simama, bonyeza E, subiri ukaguzi.

## Modeli za .glb (hiari)
1. Weka faili la basi (leseni inayoruhusu, mfano CC0/CC-BY) kwenye `models/`, mfano `models/scania.glb`.
2. Kwenye `data.js` ondoa maoni kwenye `glb: 'models/scania.glb'` ya basi hilo.
3. Ikiwa basi linaelekea nyuma, weka `glbYaw: Math.PI`. Ukubwa unarekebishwa kiotomatiki kulingana na `len`.
Basi likishindwa kupakia, mchezo unatumia basi la msingi.
Magari ya barabarani (sedan, suv, pickup, matatu, lorry, semi) yanaweza kubadilishwa vivyo hivyo kupitia `TRAFFIC_GLB` kwenye `data.js`.

## Gia, indicator na hazards
- `N` badilisha gia: **Auto** (yenyewe) / **Semi** (wewe unabadilisha, bila kuzima injini) / **Manual** (injini inaweza kuzima ukianza gia ya juu).
- `I` gia juu · `K` gia chini (Manual ina N = neutral) · `Z`/`X` indicator kushoto/kulia (hujizima baada ya kona) · `F` hazards.
- Kwenye simu: vitufe vidogo upande wa kushoto (⚠ ◁ ▷ G+ G− na aina ya gia).
- Msimbo uko kwenye `drive.js`.

## Mikopo
Angalia `CREDITS.md` (modeli ya Ideale inahitaji kumtaja mwandishi).

## Stendi, sheli na gereji
- **Stendi:** kila kituo kina jengo lenye mlango wa kuingia na wa kutoka (abiria), lango la kuingia/kutoka (magari), dawati la tiketi, viti, vibanda vya wauzaji ndani na nje, na watu wanaotembea. Safari huanzia stendi ya kwanza na abiria hupakiwa mwanzoni.
- **Sheli:** mbele ya kila stendi (karibu mita 120 baada yake). Simama kando ya pampu, bonyeza **E**, mhudumu analeta mpira; shikilia **JAZA** (au **J**) kujaza lita kwa lita, kisha **MALIZA & LIPA** (au **E**): mpira unaondolewa na malipo yanafanyika. Mafuta hayajazwi tena kiotomatiki stendi.
- **Gereji:** upande wa kulia wa barabara baada ya sheli. Simama na bonyeza **E** kutengeneza uharibifu wa basi (gharama kulingana na asilimia ya uharibifu).
- Msimbo uko kwenye `stations.js`.

## App ya simu (PWA)
- Weka mradi kwenye **GitHub Pages** (au hosting yoyote ya **https**). Fungua kiungo kwenye simu:
  - **Android (Chrome):** kitufe cha "📲 Weka kwenye simu" kwenye skrini ya kwanza, au menyu ⋮ > Install app.
  - **iPhone (Safari):** Shiriki > Ongeza kwenye Skrini ya Kwanza.
- Baada ya kufunguliwa mara moja mchezo unafanya kazi bila intaneti (alama na rekodi za Supabase zinahitaji mtandao).
- Ukibadilisha faili yoyote, ongeza namba ya `VERSION` ndani ya `sw.js` ili simu zipate toleo jipya.
- Faili: `manifest.webmanifest`, `sw.js`, `pwa.js`, folda `icons/`.
