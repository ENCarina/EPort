import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  const consultationData = [
    {
      id: 1,
      name: 'Kardiológiai konzultáció',
      description: 'Első kardiológiai panaszok áttekintése és kezelési terv.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 25000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Kardiológiai állapotfelmérés',
      description: 'Részletes kardiovaszkuláris rizikófelmérés és kontroll terv.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 27000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Szívultrahang vizsgálat',
      description: 'Szívultrahang alapú funkcionális állapotfelmérés.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 28000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Terheléses EKG vizsgálat',
      description: 'Terhelés alatti kardiológiai monitorozás.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 32000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Fogászati konzultáció',
      description: 'Fogászati panaszok áttekintése és kezelési javaslat.',
      specialty: 'Fogászat',
      duration: 30,
      price: 15000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Fogászati állapotfelmérés',
      description: 'Teljes fogazati és szájüregi állapotfelmérés.',
      specialty: 'Fogászat',
      duration: 30,
      price: 18000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'Fogkőleszedés',
      description: 'Ultrahangos fogkő-eltávolítás és polírozás.',
      specialty: 'Fogászat',
      duration: 30,
      price: 22000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Bölcsességfog műtét',
      description: 'Impaktált bölcsességfog sebészi eltávolítása.',
      specialty: 'Fogászat',
      duration: 30,
      price: 55000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: 'Pszichiátriai első konzultáció',
      description: 'Hosszabb mélyinterjú és diagnózis felállítás.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 35000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      name: 'Pszichiátriai kontroll vizit',
      description: 'Állapotkövetés és terápiás finomhangolás.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 30000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      name: 'Szorongáskezelési konzultáció',
      description: 'Szorongásos panaszok célzott pszichiátriai ellátása.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 33000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      name: 'Alvásprobléma kivizsgálás',
      description: 'Alvászavarok pszichiátriai hátterének feltárása.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 31000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 13,
      name: 'Anyajegyszűrés digitális dermatoszkóppal',
      description: 'Bőrképletek vizsgálata korszerű digitális eszközzel.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 22000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      name: 'Akne kezelési konzultáció',
      description: 'Személyre szabott akne terápiás terv felállítása.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 18000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      name: 'Ekcéma és allergiás bőrtünet vizsgálat',
      description: 'Krónikus bőrpanaszok differenciáldiagnosztikája.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 19000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      name: 'Bőrsebészeti anyajegy eltávolítás konzultáció',
      description: 'Bőrsebészeti beavatkozás előtti vizsgálat és tervezés.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 26000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      name: 'Gyermek általános vizsgálat',
      description: 'Általános gyermekorvosi állapotfelmérés.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 16000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      name: 'Csecsemő fejlődési kontroll',
      description: 'Mozgás- és fejlődéskövetés csecsemőkorban.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 17000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 19,
      name: 'Gyermek láz és fertőzéses panasz vizsgálat',
      description: 'Akut gyermekpanaszok gyors kivizsgálása.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 15000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      name: 'Gyermek allergológiai konzultáció',
      description: 'Allergiás tünetek kivizsgálása gyermekkorban.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 19000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      name: 'Ortopédiai szakvizsgálat',
      description: 'Mozgásszervi fájdalmak és eltérések kivizsgálása.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 23000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 22,
      name: 'Gerinc és tartáselemzés',
      description: 'Tartáshibák és gerincpanaszok komplex felmérése.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 21000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 23,
      name: 'Sport sérülés utáni kontroll',
      description: 'Terhelhetőség és rehabilitációs állapot vizsgálata.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 24000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 24,
      name: 'Térd- és csípőfájdalom konzultáció',
      description: 'Ízületi fájdalmak kivizsgálása és kezelési terv.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 25000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 25,
      name: 'Nőgyógyászati szűrővizsgálat',
      description: 'Rutin nőgyógyászati ellenőrzés citológiával.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 26000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 26,
      name: 'Terhesgondozási konzultáció',
      description: 'Terhesség alatti állapotkövetés és tanácsadás.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 29000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 27,
      name: 'Hormonális kivizsgálási konzultáció',
      description: 'Hormonális tünetek okainak feltárása.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 27000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 28,
      name: 'Menopauza tanácsadás',
      description: 'Perimenopauzás és menopauzás panaszok célzott kezelése.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 25000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  if (db && db.Consultation) {
    await db.Consultation.bulkCreate(consultationData);
  } else {
    await QueryInterface.bulkInsert('consultations', consultationData);
  }
}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('consultations', null, {});
}

export { up, down }
