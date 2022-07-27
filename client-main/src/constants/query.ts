import {
    provideApolloClient,
    useMutation,
    useQuery
} from "@vue/apollo-composable"
import gql from "graphql-tag"
import { apolloClient } from "~/ApolloClient"
// console.log("🚀 ~ file: query.ts ~ line 8 ~ apolloClient", apolloClient)

provideApolloClient(apolloClient)

export const FOLDER_FIELDS = gql`
    fragment FolderFields on Folder {
        id
        name
        parent
        description
        shareWith
    }
`

export const { result: infoData } = useQuery(gql`
    query getInfo {
        info
    }
`)

//example query
const MESSAGES = gql`
    query getMessages {
        messages {
            id
            text
        }
    }
`

export const GETFOLDERS = gql`
    ${FOLDER_FIELDS}
    query GetFolders($parent: String) {
        getFolders(parent: $parent) {
            ...FolderFields
        }
    }
`

export const DELETEFOLDERS = gql`
    mutation DeleteFolder($id: String!) {
        deleteFolder(id: $id)
    }
`

// export const { result: GetTeam } = useQuery(gql`
//     query GetTeam {
//         getTeam {
//             id
//             name
//         }
//     }
// `)
// console.log("🚀 ~ file: query.ts ~ line 19 ~ GetTeam", GetTeam)

export const {
    mutate: sendMessage,
    loading: captureEmailLoading,
    onDone,
    onError
} = useMutation(gql`
    mutation CaptureEmail($email: String!) {
        captureEmail(email: $email) {
            id
            email
        }
    }
`)

export const {
    mutate: signUp,
    loading: signupLoading,
    onDone: signupDone,
    onError: signUpError
} = useMutation(gql`
    mutation Signup(
        $id: String!
        $firstname: String!
        $lastname: String!
        $password: String!
    ) {
        signup(
            id: $id
            firstname: $firstname
            lastname: $lastname
            password: $password
        ) {
            token
            user {
                id
                email
            }
        }
    }
`)

export const {
    mutate: callLogin,
    loading: loginLoading,
    onDone: loginDone,
    onError: loginError
} = useMutation(gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                email
            }
        }
    }
`)

export const {
    mutate: createFolder,
    loading: createFolderLoading,
    onDone: createFolderDone,
    onError: createFolderError
} = useMutation(
    gql`
        ${FOLDER_FIELDS}
        mutation CreateFolder($parent: String, $name: String!) {
            createFolder(parent: $parent, name: $name) {
                ...FolderFields
            }
        }
    `,
    () => ({
        // variables: {
        //     parent,
        //     name
        // },
        update(cache, { data: { createFolder } }) {
            cache.modify({
                fields: {
                    getFolders(existingFolders = []) {
                        // const newTodoRef = cache.writeFragment({
                        //     data: createFolder,
                        //     fragment: gql`
                        //         fragment FolderFields on Folder {
                        //             id
                        //             name
                        //             parent
                        //             description
                        //             shareWith
                        //         }
                        //     `
                        // })

                        // console.log("🚀 ~ file: query.ts ~ line 141 ~ update ~ newTodoRef", newTodoRef)
                        // return [newTodoRef, ...existingFolders]
                    }
                }
            })
        }
    })
)
