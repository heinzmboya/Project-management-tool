import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLScalarType } from "graphql";

import bcrypt from "bcrypt";
var jwt = require("jsonwebtoken");
// import { jwt } from 'jsonwebtoken';

import moment from "moment";
import { User, Team, Folder, Group } from "./models";
import { getUserId } from "./utils";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const JWT_SECRET = process.env.JWT_SECRET;
function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}
const avatarColors = [
    "D81B60",
    "F06292",
    "F48FB1",
    "FFB74D",
    "FF9800",
    "F57C00",
    "00897B",
    "4DB6AC",
    "80CBC4",
    "80DEEA",
    "4DD0E1",
    "00ACC1",
    "9FA8DA",
    "7986CB",
    "3949AB",
    "8E24AA",
    "BA68C8",
    "CE93D8"
];

// We need to define a custom scalar type Date because GraphQL does not have one by default.
const typeDefinitions = /* GraphQL */ `
    scalar Date
    scalar JSON
    type User {
        id: String
        name: String
        firstname: String
        lastname: String
        email: String
        avatarColor: String
        jobTitle: String
        team: String
        role: String
        status: String
        createdAt: Date
    }
    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        info: String!
        getTeam: Team
        getFolders(parent: String): [Folder]
        getFolder(id: String!): Folder
    }

    type Team {
        id: String
        name: String
    }

    type Folder {
        id: String
        name: String
        parent: String
        description: String
        shareWith: [JSON]
    }

    type Mutation {
        captureEmail(email: String!): User
        signup(
            id: String!
            firstname: String!
            lastname: String!
            password: String!
        ): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createFolder(parent: String, name: String!): Folder
        deleteFolder(id: String!): Boolean
    }
`;

async function deleteSubfolders(id) {
    const folders = await Folder.find({ parent: id });
    for (const folder of folders) {
        await deleteSubfolders(folder.id);
        await Folder.deleteOne({ _id: folder.id });
    }
}

const resolvers = {
    Query: {
        info: () => `tools/schema This is the API of a Hackernews Clone`,
        async getTeam(_: any, args: any, context: any) {
            const userId = getUserId(context);
            const user = await User.findById(userId);
            return await Team.findById(user.team);
        },
        async getFolders(_, { parent }, context) {
            const userId = getUserId(context);
            if (parent) {
                return await Folder.find({ parent });
            } else {
                const user = await User.findById(userId);
                const groups = await Group.find(
                    { users: new ObjectId(userId) },
                    "_id"
                );
                const ids = groups
                    .map(o => o._id)
                    .concat(
                        ["External User", "Collaborator"].includes(user.role)
                            ? [new ObjectId(userId)]
                            : [new ObjectId(userId), user.team]
                    );
                return await Folder.find({ "shareWith.item": ids }).populate(
                    "shareWith"
                );
            }
        },
        async getFolder(_, { id }, context) {
            const userId = getUserId(context);
            return await Folder.findById(id).populate("shareWith");
        }
    },

    Mutation: {
        captureEmail: async (parent: unknown, args: { email: string }) => {
            const isEmailTaken = await User.findOne({ email: args.email });
            if (isEmailTaken) {
                throw new Error("This email is already taken");
            }

            const user = await User.create({
                email: args.email,
                role: "Owner",
                status: "Pending"
            });
            return user;
        },
        signup: async (
            _,
            args: { email: string; firstname; lastname; password; id }
        ) => {
            const { firstname, lastname, password, id } = args;
            const user = await User.findById(id);
            const common = {
                firstname,
                lastname,
                name: `${firstname} ${lastname}`,
                avatarColor: randomChoice(avatarColors),
                password: await bcrypt.hash(password, 10),
                status: "Active"
            };
            if (user.role === "Owner") {
                const team = await Team.create({
                    name: `${common.name}'s Team`
                });
                user.set({
                    ...common,
                    team: team.id,
                    jobTitle: "CEO/Owner/Founder"
                });
            } else {
                user.set(common);
            }
            await user.save();
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET
            );
            return { token, user };
        },
        login: async (_, args: { email: string; password }) => {
            const { email, password } = args;

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("No user with that email");
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Incorrect password");
            }
            const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
            return { token, user };
        },
        async createFolder(_, { parent, name }, context) {
            const userId = getUserId(context);
            const folder = await Folder.create({
                name,
                parent: parent || undefined,
                shareWith: parent
                    ? []
                    : [
                          {
                              kind: "Team",
                              item: (await User.findById(userId)).team
                          }
                      ]
            });
            return await Folder.findById(folder.id).populate("shareWith.item");
        },
        async deleteFolder(_, { id }, context) {
            const userId = getUserId(context);
            await Folder.deleteOne({ _id: id });
            deleteSubfolders(id);
            return true;
        }
    },

    Date: new GraphQLScalarType({
        name: "Date",
        description: "Date custom scalar type",
        parseValue: (value: any) => moment(value).toDate(), // value from the client
        serialize: (value: any) => value.getTime(), // value sent to the client
        parseLiteral: (ast: any) => ast
    })
};

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
});
