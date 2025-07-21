import { Contact } from '../models/contactModel.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  const contact = await Contact.create(contactData);
  return contact;
};

export const updateContact = async (contactId, updateData) => {
  const contact = await Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
  });
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
};
