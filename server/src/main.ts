import { createServer } from '@graphql-yoga/node'
import mongoose from 'mongoose'
import 'dotenv/config'

// import { execute, parse } from 'graphql'
// import { schema as schema } from './schema'
import { schema } from './schema-tools'
// import { resolvers } from './resolvers'
// import { schema } from './schema'
let url = process.env.MONGODB_URI

console.log('url', url);


// mongoose.connect(process.env.MONGODB_URI)
// const db = mongoose.connection
// db.on("error", console.error.bind(console, "connection error"))
// db.once("open", function (callback) {
//     console.log("Connection Succeeded")
// })

dbConnect().catch(err => console.log(err));

async function dbConnect() {
    await mongoose.connect(`${url}`);
    console.log("Connection Succeeded")

}

async function main() {
    const server = createServer({
        schema
        // schema: { typeDefs: 'src/schema.graphql', resolvers },
    })

    await server.start()
}


main()