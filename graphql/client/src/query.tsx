import { gql} from 'apollo-boost';

export const ADD_PRODUCT = gql`
mutation($name:String!,$categorId: String!){
  addProduct(name:$name,category:$categorId){
    id,name,
    category{
    id,name,
    	products{
        id,name
      }
  }
  }
}`

export const FETCH_ALL_PRODUCTS = gql`
query{
  getProducts{
    id,name,
    category{
      id,name, 
      products{
        id,name
      }
    }
  }
}

`;

export const CATEGROIES_PRODUCTS = gql`
query{
    getCategories{
      id,name, products{
        id,name
      }
    }
    getProducts{
      id,name,
      category{
        id,name, 
        products{
          id,name
        }
      }
    }
  }
`;