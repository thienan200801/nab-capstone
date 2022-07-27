import { gql, useMutation, useQuery } from '@apollo/client'

const ADD_PRODUCT = gql`mutation addProduct($item: AddProductInput!){
    addProduct(product: $item) {
      id
    }
}`


export const useMutationAddProduct = () => useMutation(ADD_PRODUCT);
