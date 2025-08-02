import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
// This service file handles the business logic for contacts, including CRUD operations.
export const getAllContacts = async ({
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
  const sortOption = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const finalFilters = { ...filter, userId };

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(finalFilters),
    Contact.find(finalFilters).sort(sortOption).skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
