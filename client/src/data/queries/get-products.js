import { gql, useQuery } from '@apollo/client'

const GET_PRODUCTS = gql`query getProduct{
    products {
      id
      name
      price
      stock
      colors {
        name
        hexValue
      }
      description
      categories
      pictures
      sizes
      featuringFrom
      featuringTo
    }
}`

export const useQueryGetProducts = () => useQuery(GET_PRODUCTS);
