import jwt from 'jsonwebtoken'
require('dotenv').config()

export function getUserId(context) {
    // console.dir(context.request.headers, { depth: null })
    // const Authorization = context.request.get('Authorization')
    // const Authorization = context.variables.authorization //http://0.0.0.0:4000/graphql
    const Authorization = context.req.headers.authorization
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '')
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        return id
    }
    throw new Error('Not authenticated')
}