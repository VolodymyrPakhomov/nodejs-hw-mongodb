import { Contact } from '../models/contactModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const sortOption = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(),
    Contact.find().sort(sortOption).skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
