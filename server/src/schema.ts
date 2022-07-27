import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString } from "graphql";

import moment from 'moment'
import { User as UserModel } from './models'

const dateValue = (value) => {
    if (value instanceof Date) {
        return +value;
    }
}
const DateType = new GraphQLScalarType({
    name: 'Date',
    serialize: dateValue,
    parseValue: dateValue,
    parseLiteral(ast) {
        return dateValue(ast);
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        url: { type: GraphQLString },
        name: { type: GraphQLString },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        avatarColor: { type: GraphQLString },
        jobTitle: { type: GraphQLString },
        team: { type: GraphQLString },
        role: { type: GraphQLString },
        status: { type: GraphQLString },
        createdAt: { type: DateType }
        // createdAt: Date
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        info: {
            type: GraphQLString,
            resolve(parent, args) {
                return `This is the API of a Hackernews Clone`
            },
        },

    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        captureEmail: {
            type: UserType,
            args: {
                // id: { type: GraphQLID },
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const isEmailTaken = await UserModel.findOne({ email: args.email })
                if (isEmailTaken) {
                    throw new Error('This email is already taken')
                }

                const user = await UserModel.create({
                    email: args.email,
                    role: 'Owner',
                    status: 'Pending'
                })
                return user
            }
        }
    }
})


export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation
});