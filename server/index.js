import { ApolloServer } from 'apollo-server-express';
import { ApolloError, ApolloServerPluginDrainHttpServer, gql } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const schema = gql`
    type Query {
        product(id: ID!): Product
        products: [Product!]
        customer(customerId: ID!): Customer
        fee(location: String!): Fee
    }

    type Mutation {
        addProduct(product: AddProductInput!): MutationResponse
        updateProduct(product: UpdateProductInput!): MutationResponse
        removeProduct(id: ID!): MutationResponse
        updateCustomer(customer: CustomerInput!): MutationResponse
        addItemToCart(customerId: ID!, item: CartItemInput!): MutationResponse
        emptyCart(customerId: ID!): MutationResponse
    }

    type Product {
        id: ID!
        name: String!
        price: Int!
        stock: Int!
        colors: [Color!]!
        
        description: String
        categories: [String!]
        pictures: [String!]
        sizes: [String!]

        featuringFrom: String
        featuringTo: String
    }

    type Color {
        name: String!
        hexValue: String!
    }

    type Customer {
        id: ID!
        items: [CartItem!]!
        name: String
        location: String
    }

    type CartItem {
        productId: ID!
        color: String
        size: String
        quantity: Int
    }

    type Fee {
        shipping: Int
        tax: Float
    }

    input ColorInput {
        name: String!
        hexValue: String!
    }

    input AddProductInput {
        name: String!
        price: Int!
        stock: Int!
        description: String
        categories: [String!]
        pictures: [String!]
        colors: [ColorInput!]!
        sizes: [String!]
    }

    input UpdateProductInput {
        id: ID!
        name: String
        price: Int
        stock: Int
        description: String
        categories: [String!]
        pictures: [String!]
        colors: [ColorInput!]
        sizes: [String!]
    }

    input CartItemInput {
        productId: ID!
        color: String!
        size: String
        quantity: Int = 1
    }

    input CustomerInput {
        customerId: String!
        name: String
        location: String
        items: [CartItemInput!]
    }

    type MutationResponse {
        id: ID!
    }
`

let productsStorage = (() => {
    try {
        const products = JSON.parse(readFileSync("./storage.json"))
        if (!Array.isArray(products)) throw ""
        return products
    } catch {
        return []
    }
})();

function writeProductStorage() {
    writeFileSync("./storage.json", JSON.stringify(productsStorage, null, 4))
}

const customers = {}

const fees = {}

const resolvers = {
    Query: {
        product: (_, { id }) => productsStorage.find(({ id: productId }) => productId === id),
        products: () => productsStorage,
        customer: (_, { customerId }) => {
            if (!(customerId in customers)) {
                customers[customerId] = {
                    id: customerId,
                    items: [],
                }
            }
            return customers[customerId]
        },
        fee: (_, { location }) => {
            location = location.toLowerCase().trim()
            if (!location) {
                throw new ApolloError("No location is provided")
            }
            if (!(location in fees)) {
                fees[location] = {
                    shipping: Math.round(Math.random() * 10) + 5,
                    tax: Math.round(Math.random() * 20) / 100,
                }
            }
            return fees[location]
        }
    },

    Mutation: {
        addProduct(_, { product }) {
            const id = randomUUID()
            if (!product.colors?.length) {
                throw new ApolloError("No product colors is provided")
            }
            productsStorage.push({ id, ...product })
            writeProductStorage()
            return { id }
        },

        updateProduct(_, { product }) {
            const { id, ...payload } = product
            const itemIndex = productsStorage.findIndex(({ id: productId }) => productId === id)
            if (itemIndex === -1) {
                throw new ApolloError(`No product with id ${id} is found`)
            }

            productsStorage[itemIndex] = {
                ...productsStorage[itemIndex],
                ...payload,
            }
            writeProductStorage()

            return { id }
        },

        removeProduct(_, args) {
            if (!productsStorage.find(({ id: productId }) => productId === args.id)) {
                throw new ApolloError(`No product with id ${args.id} is found`)
            }

            productsStorage = productsStorage.filter(({ id }) => id !== args.id)
            writeProductStorage()

            return { id: args.id }
        },

        addItemToCart(_, { customerId, item }) {
            if (!(customerId in customers)) {
                throw new ApolloError(`No customer with id ${customerId} is found`)
            }
            customers[customerId].items.push(item)
            return { id: customerId }
        },

        emptyCart(_, { customerId }) {
            if (!(customerId in customers)) {
                throw new ApolloError(`No customer with id ${customerId} is found`)
            }
            customers[customerId].items = []
            return { id: customerId }
        },

        updateCustomer(_, { customer: { customerId, ...payload } }) {
            if (!(customerId in customers)) {
                throw new ApolloError(`No customer with id ${customerId} is found`)
            }
            customers[customerId] = {
                ...customers[customerId],
                ...payload
            }
            return { id: customerId }
        },
    }
}

startApolloServer(schema, resolvers)
