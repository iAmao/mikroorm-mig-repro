import { ApolloServer, gql } from 'apollo-server';
import initOrm from './orm';

const typeDefs = gql`
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	# This "Book" type defines the queryable fields for every book in our data source.
	type Book {
		title: String
		author: String
	}

	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		books: [Book]
	}
`;

const books = [
	{
		title: 'Harry Potter and the Chamber of Secrets',
		author: 'J.K. Rowling'
	},
	{
		title: 'Jurassic Park',
		author: 'Michael Crichton'
	}
];

const resolvers = {
	Query: {
		books: () => books
	}
};

const createServer = async () => {
	const Orm = await initOrm(false);
	return new ApolloServer({
		typeDefs,
		resolvers,
		context: (...args) => {
			return {
				// A fork of orm instance.
				// Used RequestContext in MikroOrm.
				// Needed for ORMs like MikroOrm because of the identity Map mechanism
				// This will ensure that no two request would share identity maps as that could lead to a lot of collision
				orm: Orm.fork()
			};
		}
	});
};
createServer().then((server) => {
	server.listen().then(({ url }) => console.log('Server up @', url));
});
