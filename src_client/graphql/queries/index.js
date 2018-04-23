import gql from 'graphql-tag'

export const ABOUT_ME_QUERY = gql`
  query AboutMe {
    me {
      id
      username
      email
      verified
    }
  }
`

export const MY_SITES_QUERY = gql`
  query MySites {
    mySites {
      id
      url
      repo
      build_command
      public_directory
    }
  }
`
