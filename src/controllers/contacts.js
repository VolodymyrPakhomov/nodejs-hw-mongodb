import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const paginationResult = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: paginationResult,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const {
    name,
    phoneNumber,
    email,
    isFavourite = false,
    contactType,
  } = req.body;

  // if (!name || !phoneNumber || !contactType) {
  //   throw createError(
  //     400,
  //     'Missing required fields: name, phoneNumber, contactType',
  //   );
  // }

  const contactData = { ...req.body, userId: req.user._id };
  const newContact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  // if (Object.keys(updateData).length === 0) {
  //   throw createError(400, 'No fields to update');
  // }

  const updatedContact = await updateContact(contactId, req.body, req.user._id);
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const deletedContact = await deleteContact(contactId, req.user._id);
  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
