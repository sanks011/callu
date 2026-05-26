"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        select: false,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatarConfig: {
        type: Object,
        default: {},
    },
    mobile: {
        type: String,
        default: null,
    },
    // Keybinds — synced across desktop and web
    pttKeycode: {
        type: Number,
        default: 29, // Left Ctrl
    },
    muteKeycode: {
        type: Number,
        default: 0, // 0 = not set
    },
}, { timestamps: true });
var User = mongoose_1.models.User || (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
