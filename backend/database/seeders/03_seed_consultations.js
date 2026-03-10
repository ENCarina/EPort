import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  const consultationData = [
    {
      id: 1,
      name: 'Kardiológiai szakvizsgálat',
      description: 'Teljes körű szív- és érrendszeri állapotfelmérés.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 25000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,  
      name: 'Fogászati kontroll',
      description: 'Általános állapotfelmérés és tanácsadás.',
      specialty: 'Fogászat',
      duration: 30,
      price: 15000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Pszichiátriai első konzultáció',
      description: 'Hosszabb mélyinterjú és diagnózis felállítás.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 35000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: 'Szívultrahang vizsgálat',
      description: 'Szívultrahang alapú funkcionális állapotfelmérés.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 28000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: 'Terheléses EKG vizsgálat',
      description: 'Terhelés alatti kardiológiai monitorozás.',
      specialty: 'Kardiológia',
      duration: 30,
      price: 32000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      name: 'Anyajegyszűrés digitális dermatoszkóppal',
      description: 'Bőrképletek vizsgálata korszerű digitális eszközzel.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 22000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      name: 'Akne kezelési konzultáció',
      description: 'Személyre szabott akne terápiás terv felállítása.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 18000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      name: 'Ekcéma és allergiás bőrtünet vizsgálat',
      description: 'Krónikus bőrpanaszok differenciáldiagnosztikája.',
      specialty: 'Bőrgyógyászat',
      duration: 30,
      price: 19000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      name: 'Gyermek általános vizsgálat',
      description: 'Általános gyermekorvosi állapotfelmérés.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 16000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10,
      name: 'Csecsemő fejlődési kontroll',
      description: 'Mozgás- és fejlődéskövetés csecsemőkorban.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 17000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 11,
      name: 'Gyermek láz és fertőzéses panasz vizsgálat',
      description: 'Akut gyermekpanaszok gyors kivizsgálása.',
      specialty: 'Gyermekgyógyászat',
      duration: 30,
      price: 15000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 12,
      name: 'Ortopédiai szakvizsgálat',
      description: 'Mozgásszervi fájdalmak és eltérések kivizsgálása.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 23000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 13,
      name: 'Gerinc és tartáselemzés',
      description: 'Tartáshibák és gerincpanaszok komplex felmérése.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 21000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 14,
      name: 'Sport sérülés utáni kontroll',
      description: 'Terhelhetőség és rehabilitációs állapot vizsgálata.',
      specialty: 'Ortopédia',
      duration: 30,
      price: 24000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 15,
      name: 'Nőgyógyászati szűrővizsgálat',
      description: 'Rutin nőgyógyászati ellenőrzés citológiával.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 26000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 16,
      name: 'Terhesgondozási konzultáció',
      description: 'Terhesség alatti állapotkövetés és tanácsadás.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 29000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 17,
      name: 'Hormonális kivizsgálási konzultáció',
      description: 'Hormonális tünetek okainak feltárása.',
      specialty: 'Nőgyógyászat',
      duration: 30,
      price: 27000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 18,
      name: 'Fogtömés konzultáció és kontroll',
      description: 'Szuvasodás kezelési terv és utóellenőrzés.',
      specialty: 'Fogászat',
      duration: 30,
      price: 18000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 19,
      name: 'Szájhigiénés állapotfelmérés',
      description: 'Megelőző fogászati tanácsadás és állapotfelmérés.',
      specialty: 'Fogászat',
      duration: 30,
      price: 14000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20,
      name: 'Pszichiátriai kontroll vizit',
      description: 'Állapotkövetés és terápiás finomhangolás.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 30000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      name: 'Szorongáskezelési konzultáció',
      description: 'Szorongásos panaszok célzott pszichiátriai ellátása.',
      specialty: 'Pszichiátria',
      duration: 30,
      price: 33000.00,
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
