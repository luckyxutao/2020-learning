import React, { useState } from 'react';
import { Category, Product } from './types';
import { useMutation} from '@apollo/react-hooks'
import { ADD_PRODUCT,FETCH_ALL_PRODUCTS} from './query';
interface Props {
    categories: Array<Category>
}

function AddProduct(props: Props) {
    const [product,setProduct] = useState<Product>({
        name:'', categorId:''
    });
    const [addNewProduct] = useMutation(ADD_PRODUCT);
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        addNewProduct({
            variables:product,refetchQueries:[{
                query:FETCH_ALL_PRODUCTS
            }]
        });
    }
    const { categories } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>产品名称</label>
                <input value={product.name} onChange={(e)=>{
                    setProduct({
                        ...product,
                        name : e.target.value
                    })
                }} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label>产品分类</label>
                <select value={product.categorId} onChange={(e)=>{
                    setProduct({
                        ...product,
                        categorId:e.target.value
                    })
                }} className="form-control">
                    <option key="-1" value="">请选择分类</option>
                    {
                        categories.map((item: Category) => {
                            return <option value={item.id} key={item.id}>{item.name}</option>
                        })
                    }
               </select>
            </div>
            <div className="form-group">
                <input type="submit" className="btn btn-primary" />
            </div>
        </form>
    )
}

export default AddProduct;