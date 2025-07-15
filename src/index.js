import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

import { Contact } from './models/contactModel.js';
import fs from 'fs/promises';
import path from 'path';

const bootstrap = async () => {
  await initMongoConnection();

  // Проверяем, есть ли контакты в коллекции
  const contactsCount = await Contact.countDocuments();
  if (contactsCount === 0) {
    try {
      const contactsPath = path.join(process.cwd(), 'src', 'contacts.json');
      const contactsData = await fs.readFile(contactsPath, 'utf-8');
      const contacts = JSON.parse(contactsData);
      // Преобразуем phone -> phoneNumber для схемы
      const normalizedContacts = contacts.map((c) => ({
        name: c.name,
        email: c.email,
        phoneNumber: c.phone || c.phoneNumber,
        contactType: c.contactType || 'personal',
      }));
      await Contact.insertMany(normalizedContacts);
      console.log('Контакты успешно импортированы из contacts.json');
    } catch (err) {
      console.error('Ошибка импорта контактов:', err);
    }
  }

  setupServer();
};

bootstrap().catch((error) => {
  console.error('Server initialization error:', error);
});
