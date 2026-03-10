import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  if(db.Staff) {
    await db.Staff.bulkCreate([
      
      {id: 1, userId: 101, role: 'doctor', specialty: 'Kardiológus', isAvailable: true, bio: '20 éves szakmai tapasztalattal rendelkező szakorvos.', imageUrl: 'https://example.com/images/dr_kovacs.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 2, userId: 102, role: 'doctor', specialty: 'Fogorvos', isAvailable: true, bio: '15 éves nemzetközi tapasztalattal rendelkező fogorvos.', imageUrl: 'https://example.com/images/dr_toth.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 3, userId: 103, role: 'doctor', specialty: 'Pszichiáter', isAvailable: true, bio: 'amerikai főorvos.', imageUrl: 'https://example.com/images/dr_house.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 5, userId: 104, role: 'doctor', specialty: 'Bőrgyógyász', isAvailable: true, bio: 'Modern diagnosztikai szemléletű bőrgyógyász szakorvos.', imageUrl: 'https://example.com/images/dr_farkas.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 6, userId: 105, role: 'doctor', specialty: 'Kardiológus', isAvailable: true, bio: 'Szívultrahang és terheléses vizsgálatok specialistája.', imageUrl: 'https://example.com/images/dr_varga.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 7, userId: 106, role: 'doctor', specialty: 'Gyermekgyógyász', isAvailable: true, bio: 'Családbarát szemléletű gyermekorvos, preventív fókuszú ellátással.', imageUrl: 'https://example.com/images/dr_szabo.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 8, userId: 107, role: 'doctor', specialty: 'Ortopéd szakorvos', isAvailable: true, bio: 'Mozgásszervi panaszok diagnosztikája és konzervatív kezelése.', imageUrl: 'https://example.com/images/dr_nemeth.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 9, userId: 108, role: 'doctor', specialty: 'Nőgyógyász', isAvailable: true, bio: 'Nőgyógyászati szűrések és hormonális konzultációk szakértője.', imageUrl: 'https://example.com/images/dr_horvath.jpg', createdAt: new Date(), updatedAt: new Date()},
      {id: 4, userId: 100, role: 'staff', specialty: 'Vezető asszisztens', isAvailable: true, bio: 'Laborvizsgálatok és adminisztráció felelőse.', imageUrl: null, createdAt: new Date(),updatedAt: new Date()}
    ]);
  }else {
    await QueryInterface.bulkInsert('staff', [
      {
    userId: 101, 
    role: 'doctor', 
    specialty: 'Kardiológus', 
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
    ]);
  }

}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('staff',  null, {});
}

export { up, down }