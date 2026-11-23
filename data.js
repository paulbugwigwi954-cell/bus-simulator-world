// Njia (routes) na mabasi (buses). Kuongeza nchi/njia/basi: ongeza kipengee hapa tu.
// Kituo chenye 'border' kama kipengee cha tatu ni mpaka (ukaguzi wa hati + ada: borderFee). fine = faini ya taa nyekundu.
window.ROUTES = {
  dodoma: { id: 'dar-dodoma', fine: 30000, name: 'Dar es Salaam → Dodoma', km: 450, cur: 'TZS', rate: 78, round: 100, fuelPrice: 1900, rain: .25, holes: 18,
    hour: 15.5, ground: 0x7d8a3c, leaf: 0x4d7a2a, curve: [55, 650, 22, 210],
    stops: [['Ubungo (Dar)', 0], ['Chalinze', 100], ['Morogoro', 195], ['Gairo', 305], ['Kibaigwa', 385], ['Dodoma', 450]] },
  mombasa: { id: 'nairobi-mombasa', fine: 1500, name: 'Nairobi → Mombasa', km: 485, cur: 'KES', rate: 3.1, round: 10, fuelPrice: 190, rain: .3, holes: 12,
    hour: 13.5, ground: 0x9a7a45, leaf: 0x6b7f2f, curve: [30, 900, 14, 300],
    stops: [['Nairobi', 0], ['Emali', 150], ['Mtito Andei', 235], ['Voi', 325], ['Mariakani', 450], ['Mombasa', 485]] },
  mbale: { id: 'kampala-mbale', fine: 40000, name: 'Kampala → Mbale', km: 250, cur: 'UGX', rate: 110, round: 500, fuelPrice: 5200, rain: .6, holes: 30,
    hour: 14, ground: 0x5f8a3a, leaf: 0x2f6b2a, curve: [40, 500, 25, 180],
    stops: [['Kampala', 0], ['Jinja', 80], ['Iganga', 125], ['Tororo', 210], ['Mbale', 250]] },
  namanga: { id: 'arusha-nairobi', fine: 1500, name: 'Arusha → Nairobi (Namanga)', km: 270, cur: 'KES', rate: 11, round: 10, fuelPrice: 190, borderFee: 2000, rain: .3, holes: 20,
    hour: 7.5, ground: 0xa89060, leaf: 0x7a8a3a, curve: [35, 700, 18, 250],
    stops: [['Arusha', 0], ['Longido', 85], ['Namanga (Mpaka)', 110, 'border'], ['Kajiado', 190], ['Nairobi', 270]] }
};
// Modeli za magari ya barabarani (hiari): weka faili kwenye models/ kisha ondoa maoni
window.TRAFFIC_GLB = { /* sedan: 'models/sedan.glb', suv: 'models/suv.glb', pickup: 'models/pickup.glb', matatu: 'models/matatu.glb', lorry: 'models/lorry.glb', semi: 'models/semi.glb' */ };
// brand = jina la kampuni la kubuni; price = bei kwa TZS (lazima ilingane na function bus_price kwenye Supabase)
window.BUSES = {
  scania: { id: 'scania', name: 'Scania Marcopolo Paradiso', brand: 'SIMBA COACH', price: 25000000, len: 12.9, col: 0xf2f2ee, lower: 0x2a2e34,
    stripes: [[0xc0272d, 1.55, .2], [0x111111, 1.32, .08]], axles: [-3.9, 2.8, 4.4], rake: .18, ac: false,
    vmax: 30, acc: 5, tank: 240, fuel: .024, pax: 54, cargo: 60, /* glb: 'models/scania.glb', glbYaw: 0, */ hz: 36, gears: [0, 7, 13, 19, 25], horn: [350, 440] },
  yutong: { id: 'yutong', name: 'Yutong ZK6122', brand: 'TEMBO LINES', price: 12000000, len: 12.0, col: 0xf6f6f6, lower: 0x37424d,
    stripes: [[0x1565c0, 1.6, .24], [0x2e9e46, 1.38, .1]], axles: [-3.5, 3.4], rake: .05, ac: true,
    vmax: 27, acc: 4.6, tank: 200, fuel: .02, pax: 50, cargo: 50, /* glb: 'models/yutong.glb', glbYaw: 0, */ hz: 46, gears: [0, 6, 12, 18, 23], horn: [420, 520] },
  // Bei lazima zilingane na bus_price() kwenye Supabase (ideale 18,000,000; torino 40,000,000)
  ideale: { id: 'ideale', name: 'Marcopolo Ideale 770', brand: 'KILIMANJARO EXPRESS', price: 18000000, len: 7.7, col: 0xf4f1ea, lower: 0x2f3a45,
    stripes: [[0xe07b00, 1.58, .22], [0x1a1a1a, 1.35, .08]], axles: [-2.3, 1.9, 2.8], rake: .1, ac: true, glb: 'models/marcopolo_ideale.glb',
    vmax: 26, acc: 5.2, tank: 120, fuel: .016, pax: 30, cargo: 20, hz: 44, gears: [0, 6, 11, 16, 21], horn: [420, 520] },
  torino: { id: 'torino', name: 'Marcopolo Paradiso G7 Torino', brand: 'SAFARI GOLD', price: 40000000, len: 14.0, col: 0xeeeeee, lower: 0x1f252b,
    stripes: [[0x0d47a1, 1.7, .26], [0xf5c518, 1.45, .09]], axles: [-4.4, 3.2, 4.9], rake: .22, ac: true,
    vmax: 33, acc: 5.6, tank: 300, fuel: .027, pax: 60, cargo: 80, hz: 34, gears: [0, 8, 15, 22, 28], horn: [330, 420] }
};
