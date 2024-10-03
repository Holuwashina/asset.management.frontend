import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://asset-management-backend-yib3.onrender.com/api/v1/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;
