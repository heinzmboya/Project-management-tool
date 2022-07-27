import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    from
} from "@apollo/client/core";
// import { ApolloLink, from } from '@apollo/client'
// import { logErrorMessages } from '@vue/apollo-util'
// HTTP connection to the API
// const uri = `${process.env.VUE_APP_URI}/graphql`

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: "http://0.0.0.0:4000/graphql"
});

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem("user-token");
    // operation.setContext({
    //   headers: {
    //     authorization: token ? `Bearer ${token}` : null
    //   }
    // })
    operation.setContext(({ headers }) => ({
        headers: {
            authorization: token ? `Bearer ${token}` : null,
            ...headers
        }
    }));
    return forward(operation);
});

const additiveLink = from([authMiddleware, httpLink]);

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: additiveLink,
    cache: new InMemoryCache()
});
