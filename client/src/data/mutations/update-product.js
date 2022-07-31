import { gql, useMutation} from '@apollo/client'

const UPDATE_PRODUCT = gql`mutation UpdateProduct($product: UpdateProductInput!) {
    updateProduct(product: $product) {
      id
    }
}`


export const useMutationUpdateProduct = () => useMutation(UPDATE_PRODUCT);
