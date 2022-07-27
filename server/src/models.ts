import mongoose from "mongoose"
import moment from 'moment'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

//inserts timestamps(createdAt and updateAt) into every model.
function buildModel(name: string, schema: any) {
    return mongoose.model(name, new Schema(schema, { timestamps: true }))
}

export const Folder = buildModel('Folder', {
    name: String,
    description: String,
    shareWith: [{
        kind: String,
        item: { type: ObjectId, refPath: 'shareWith.kind' }
    }],
    parent: { type: ObjectId, ref: 'Folder' },
})
module.exports.Folder = Folder

export const Team = Folder.discriminator('Team', new Schema({
}, { timestamps: true }))

export const User = buildModel('User', {
    name: {
        type: String,
        default: ''
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    jobTitle: {
        type: String,
        default: ''
    },
    avatarColor: String,
    team: { type: ObjectId, ref: 'Team' },
    role: String,
    status: String
})

export const Group = buildModel('Group', {
    team: { type: ObjectId, ref: 'Team' },
    name: String,
    initials: String,
    avatarColor: String,
    users: [{ type: ObjectId, ref: 'User' }],
  })