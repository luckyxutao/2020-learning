import React from 'react';
import { Product } from './types';
function ProductDetail(props: any) {
    console.log(props.product);

    if (!props.product)
        return null;
    return (
        <ul className="list-group">
            <li className="list-group-item">
                ID:{props.product.id}
            </li>
            <li className="list-group-item">
                名称:{props.product.name}
            </li>
            <li className="list-group-item">
                分类:{props.product.category.name}
            </li>
            <li className="list-group-item">
                此分类下所有产品:
                <ul className="list-group">
                    {
                        props.product.category.products.map((product: Product, index: number) => (
                            <li key={product.id} className="list-group-item">{product.name}</li>
                        ))
                    }
                </ul>
            </li>
        </ul>
    )
}
export default ProductDetail;