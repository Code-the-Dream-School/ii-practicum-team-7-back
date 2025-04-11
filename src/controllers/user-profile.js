const Profile = require("../models/Profile");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const createProfile = async (req, res) => {
    const newProfile = { ...req.body };
    newProfile.createdBy = req.user.userId;
    const profile = await Profile.create(newProfile);
    res.status(StatusCodes.CREATED).json({ profile });
};

const getUserProfile = async (req, res) => {

    const { user: { userId }, params: { id: profileId } } = req;
    const profile = await Profile.findOne({ _id: profileId, createdBy: userId });
    if (!profile) {
        throw new NotFoundError(`No user profile with profile id:${profileId} was found.`);
    }
    res.status(StatusCodes.OK).json({ profile });

};

const updateProfile = async (req, res) => {
    const { name, email, role, phone, address, bio, skills, image } = req.body;
    if (name === "" || email === "" || role === "") {
        throw new BadRequestError("Name, email, and role fields cannot be empty.");
    }
    const updatedProfile = await Profile.findByIdAndUpdate(
        { _id: req.params.id, createdBy: req.user.userId },
        { name, email, role, phone, address, bio, skills, image },
        { new: true, runValidators: true }
    );
    if (!updatedProfile) {
        throw new NotFoundError(`No user profile with id ${req.params.id} was found.`);
    }
    res.status(StatusCodes.OK).json({ updatedProfile });
};

const deleteProfile = async (req, res) => {
    const { user: { userId }, params: { id: profileId } } = req;
    const profile = await Profile.findOneAndDelete({
        _id: profileId,
        createdBy: userId
    });
    if (!profile) {
        throw new NotFoundError(`No user profile with id ${profileId} was found.`);
    }

    res.status(StatusCodes.NO_CONTENT).send(`Profile ${profileId} was deleted.`);

};

module.exports = { createProfile, getUserProfile, updateProfile, deleteProfile };