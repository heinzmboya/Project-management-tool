import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core"
import { getMainDefinition } from "@apollo/client/utilities"
import { onError } from "@apollo/client/link/error"
import { logErrorMessages } from "@vue/apollo-util"

// HTTP connection to the API
// const uri = `${process.env.VUE_APP_URI}/graphql`

function getHeaders() {
    const headers = {} as any
    const token = window.localStorage.getItem("user-token")
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    return headers
}

// const httpLink = new HttpLink({
//     // You should use an absolute URL here
//     uri: "http://0.0.0.0:4000/graphql"
// })

const httpLink = new HttpLink({
    uri: "http://0.0.0.0:4000/graphql",
    fetch: (uri: RequestInfo, options: RequestInit) => {
        options.headers = getHeaders()
        return fetch(uri, options)
    },
})

const errorLink = onError((error) => {
    if (process.env.NODE_ENV !== "production") {
        logErrorMessages(error)
    }
})

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink),
})
