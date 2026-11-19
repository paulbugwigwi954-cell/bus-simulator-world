// Njia (routes) na mabasi (buses). Kuongeza nchi/njia/basi: ongeza kipengee hapa tu.
window.ROUTES = {
  dodoma: { id: 'dar-dodoma', name: 'Dar es Salaam → Dodoma', km: 450, cur: 'TZS', rate: 78, round: 100, fuelPrice: 1900,
    hour: 15.5, ground: 0x7d8a3c, leaf: 0x4d7a2a, curve: [55, 650, 22, 210],
    stops: [['Ubungo (Dar)', 0], ['Chalinze', 100], ['Morogoro', 195], ['Gairo', 305], ['Kibaigwa', 385], ['Dodoma', 450]] },
  mombasa: { id: 'nairobi-mombasa', name: 'Nairobi → Mombasa', km: 485, cur: 'KES', rate: 3.1, round: 10, fuelPrice: 190,
    hour: 13.5, ground: 0x9a7a45, leaf: 0x6b7f2f, curve: [30, 900, 14, 300],
    stops: [['Nairobi', 0], ['Emali', 150], ['Mtito Andei', 235], ['Voi', 325], ['Mariakani', 450], ['Mombasa', 485]] }
};
window.BUSES = {
  scania: { id: 'scania', name: 'Scania Marcopolo Paradiso', len: 12.9, col: 0xf2f2ee, lower: 0x2a2e34,
    stripes: [[0xc0272d, 1.55, .2], [0x111111, 1.32, .08]], axles: [-3.9, 2.8, 4.4], rake: .18, ac: false,
    vmax: 30, acc: 5, tank: 240, fuel: .024, pax: 54, hz: 36, gears: [0, 7, 13, 19, 25], horn: [350, 440] },
  yutong: { id: 'yutong', name: 'Yutong ZK6122', len: 12.0, col: 0xf6f6f6, lower: 0x37424d,
    stripes: [[0x1565c0, 1.6, .24], [0x2e9e46, 1.38, .1]], axles: [-3.5, 3.4], rake: .05, ac: true,
    vmax: 27, acc: 4.6, tank: 200, fuel: .02, pax: 50, hz: 46, gears: [0, 6, 12, 18, 23], horn: [420, 520] }
};
