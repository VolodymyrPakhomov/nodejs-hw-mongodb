import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

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
  const { body, user, file } = req;
  
  let photoUrl;
  if (file) {
    try {
      if (getEnvVariable('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      throw createError(500, 'Failed to upload photo');
    }
  }
  
  const contact = await createContact({ ...body, photo: photoUrl }, user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { file } = req;
  
  let photoUrl;
  if (file) {
    try {
      if (getEnvVariable('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      throw createError(500, 'Failed to upload photo');
    }
  }

  const updatedContact = await updateContact(contactId, { ...req.body, photo: photoUrl }, req.user._id);
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

export const patchContactController = async (req, res) => {
  const { params, body, file, user } = req;
  const contactId = params.contactId;

  const contact = await updateContact(
    contactId,
    { ...body, photo: file },
    user._id,
  );

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};
