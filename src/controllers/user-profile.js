const Profile = require("../models/Profile");
const { StatusCodes } = require("http-status-codes");


const createProfile = async (req, res) => {
    try {
        const newProfile = { ...req.body };
        newProfile.createdBy = req.user.userId;
        const profile = await Profile.create(newProfile);
        return res.status(StatusCodes.CREATED).json({ profile });
    } catch (error) {
        console.error("Error in createProfile controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { params: { id: profileId } } = req;
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No profile found with id: ${profileId}.`
            });
        }

        return res.status(StatusCodes.OK).json({ profile });

    } catch (error) {
        console.error("Error in getUserProfile controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, role, phone, address, bio, skills, image } = req.body;
        if (name === "" || email === "" || role === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Name, email, and role fields cannot be empty."
            });
        }
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProfile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `Profile ${req.params.id} not found.`
            });
        }
        return res.status(StatusCodes.OK).json({ updatedProfile });
    } catch (error) {
        console.error("Error in updateProfile controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const { user: { userId }, params: { id: profileId } } = req;
        const profile = await Profile.findOneAndDelete({
            _id: profileId,
            createdBy: userId
        });
        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `Profile ${profileId} not found`
            });
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error("Error in deleteProfile controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { createProfile, getUserProfile, updateProfile, deleteProfile };