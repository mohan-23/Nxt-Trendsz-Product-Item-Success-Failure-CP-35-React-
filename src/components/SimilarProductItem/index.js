import {BsFillStarFill} from 'react-icons/bs'

import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {
    brand,
    imageUrl,
    price,
    rating,

    title,
  } = productDetails

  return (
    <li className="product-item">
      <img src={imageUrl} className="image" alt={`similar product ${title}`} />
      <p className="title-product">{title}</p>
      <p className="brand-product">by {brand}</p>
      <div className="price-cart">
        <p className="price-product">Rs {price}/-</p>
        <p className="rating">
          {rating}
          <span className="star">
            <BsFillStarFill />
          </span>
        </p>
      </div>
    </li>
  )
}
export default SimilarProductItem
