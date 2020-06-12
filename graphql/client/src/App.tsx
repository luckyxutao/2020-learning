import React,{useState} from 'react';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import 'bootstrap/dist/css/bootstrap.css';
import { useQuery } from '@apollo/react-hooks';
import { CATEGROIES_PRODUCTS } from './query';
import { Product } from './types';
import ProductDetail from './ProductDetail';
function App() {
    let [product,setProduct] = useState<Product>();
    const { loading, error, data} =  useQuery(CATEGROIES_PRODUCTS);
    if(error){
        return <p>加载错误</p>
    }
    if(loading){
        return <p>加载中....</p>
    }
    const {getCategories,getProducts} = data;
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <AddProduct categories={getCategories} />
                        </div>
                        <div className="panel-body">
                            <ProductList setProduct={setProduct} products ={getProducts} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <ProductDetail product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;