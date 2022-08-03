import { gql, useMutation} from '@apollo/client'

const REMOVE_PRODUCT = gql`mutation delete($removeProductId: ID!){
    removeProduct(id: $removeProductId) {
      id
    }
}`


export const useMutationRemoveProduct = () => useMutation(REMOVE_PRODUCT);
