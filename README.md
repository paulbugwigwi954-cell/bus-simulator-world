# Safari ya Mkoani

Mchezo wa 3D wa mabasi ya mkoani. Hauhitaji build: ni faili tuli (Vercel: Framework Preset = Other).

## Faili
- `index.html` mchezo (Three.js kutoka CDN)
- `data.js` njia, vituo, mabasi (ongeza njia/basi hapa)
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
