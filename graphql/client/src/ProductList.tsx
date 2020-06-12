import React from 'react';
import { Product } from './types';
interface Props {
    products: Array<Product>,
    setProduct:any
}

function ProductList(props: Props) {
    const { setProduct} = props;
    return (
        <table className="table table-striped">
            <caption className="text-center">产品列表</caption>
            <thead>
                <tr>
                    <td>名称</td><td>分类</td>
                </tr>
            </thead>
            <tbody>
                {
                    props.products.map((item: Product) => {
                        return (
                            <tr onClick={()=>{
                                setProduct(item);
                            }} key={item.id}>
                                <td>{item.name}</td><td>{item.category?.name}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default ProductList;