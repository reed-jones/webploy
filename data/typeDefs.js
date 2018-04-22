export default `
  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    allUsers: [User!]!
    me: User
  }

  type Mutation {
    updateUser(username: String!, newUsername: String!): [Int!]!
    deleteUser(username: String!): Int!
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
  }
`
