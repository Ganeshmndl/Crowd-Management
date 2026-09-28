import FamilyMember from "../models/FamilyMember.js";
import {
  deleteCloudinaryPhoto,
  uploadedPhoto,
} from "../utils/recordHelpers.js";
import { normalizeIndianMobile } from "../utils/validators.js";

const fields = ["name", "relation", "age", "phone", "medicalNotes"];
const bodyFields = (body) =>
  Object.fromEntries(
    fields
      .filter((field) => body[field] !== undefined)
      .map((field) => [
        field,
        field === "age" && body[field] === ""
          ? null
          : field === "phone"
            ? normalizeIndianMobile(body[field])
            : body[field],
      ]),
  );

const getFamilyMembers = async (req, res) => {
  const members = await FamilyMember.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ members });
};

const getFamilyMember = async (req, res) => {
  const member = await FamilyMember.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!member) {
    res.status(404);
    throw new Error("Family member not found");
  }
  res.json({ member });
};

const createFamilyMember = async (req, res) => {
  const photo = uploadedPhoto(req.file);
  try {
    const member = await FamilyMember.create({
      ...bodyFields(req.body),
      ...(photo && { photo }),
      userId: req.user._id,
    });
    res.status(201).json({ member });
  } catch (error) {
    await deleteCloudinaryPhoto(photo);
    throw error;
  }
};

const updateFamilyMember = async (req, res) => {
  const member = await FamilyMember.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!member) {
    res.status(404);
    throw new Error("Family member not found");
  }

  const oldPhoto = member.photo?.toObject?.() || member.photo;
  Object.assign(member, bodyFields(req.body));
  if (req.file) member.photo = uploadedPhoto(req.file);

  try {
    await member.save();
    if (req.file) await deleteCloudinaryPhoto(oldPhoto);
    res.json({ member });
  } catch (error) {
    if (req.file) await deleteCloudinaryPhoto(member.photo);
    throw error;
  }
};

const deleteFamilyMember = async (req, res) => {
  const member = await FamilyMember.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!member) {
    res.status(404);
    throw new Error("Family member not found");
  }
  await deleteCloudinaryPhoto(member.photo);
  res.json({ message: "Family member deleted" });
};

export {
  createFamilyMember,
  deleteFamilyMember,
  getFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
};
