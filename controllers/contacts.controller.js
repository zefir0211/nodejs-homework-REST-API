const { Contact } = require("../models/contacts");

async function getAllContacts(req, res) {
  const { id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const allContacts = await Contact.find({ owner })
    .limit(Number(limit))
    .skip(Number(skip));

  if (!favorite) {
    res.status(200).json(allContacts);
  } else {
    const favoriteContacts = allContacts.filter(
      (contact) => contact.favorite.toString() === favorite
    );
    res.status(200).json(favoriteContacts);
  }
}

async function getContactById(req, res) {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);

  if (!contactById) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(contactById);
}

async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const { id: owner } = req.user;
  const NewContact = await Contact.create({ name, email, phone, owner });
  console.log("NewContact", NewContact);

  res.status(201).json(NewContact);
}

async function removeContact(req, res) {
  const { contactId } = req.params;
  const remove = await Contact.findByIdAndRemove(contactId);

  if (!remove) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContact(req, res) {
  const { contactId } = req.params;
  const upContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  console.log("upContact", upContact);
  if (!upContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(upContact);
}

async function updateStatusContact(req, res) {
  const { contactId } = req.params;
  const upContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!upContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(upContact);
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};