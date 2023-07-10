import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    activeProduct: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstraints.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const activeProductDetails = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const activeSimilarProductDetails = data.similar_products.map(
        product => ({
          availability: product.availability,
          brand: product.brand,
          description: product.description,
          id: product.id,
          imageUrl: product.image_url,
          price: product.price,
          rating: product.rating,
          style: product.style,
          title: product.title,
          totalReviews: product.total_reviews,
        }),
      )
      this.setState({
        activeProduct: activeProductDetails,
        similarProducts: activeSimilarProductDetails,
        apiStatus: apiStatusConstraints.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickDecrease = () => {
    const {count} = this.state
    this.setState(prevState => ({
      count: prevState.count - 1,
    }))
    if (count === 1) {
      this.setState({count: 1})
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onClickButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductDetails = () => {
    const {activeProduct, count, similarProducts} = this.state

    return (
      <>
        <Header />
        <div className="product-container">
          <div className="view-products">
            <div className="active-product-cart">
              <img
                src={activeProduct.imageUrl}
                className="active-product-img"
                alt="product"
              />
              <div className="active-product-details">
                <h1 className="product-title">{activeProduct.title}</h1>
                <p className="product-price">Rs {activeProduct.price}/-</p>
                <div className="rating-and-reviews">
                  <p className="rating">
                    {activeProduct.rating}
                    <span className="star">
                      <BsFillStarFill />
                    </span>
                  </p>
                  <p className="reviews">
                    {activeProduct.totalReviews} Reviews
                  </p>
                </div>
                <p className="description">{activeProduct.description}</p>
                <div className="row">
                  <p className="style">Available:</p>
                  <p className="span-style"> {activeProduct.availability}</p>
                </div>
                <div className="row">
                  <p className="style">Brand:</p>
                  <p className="span-style"> {activeProduct.brand}</p>
                </div>
                <hr className="line" />
                <div className="count-container">
                  <button
                    type="button"
                    className="button"
                    onClick={this.onClickDecrease}
                    data-testid="minus"
                  >
                    <BsDashSquare />
                  </button>
                  <p className="count">{count}</p>
                  <button
                    type="button"
                    className="button"
                    onClick={this.onClickIncrease}
                    data-testid="plus"
                  >
                    <BsPlusSquare />
                  </button>
                </div>
                <button type="button" className="cart-button">
                  ADD TO CART
                </button>
              </div>
            </div>
            <h1 className="similar-product-heading">Similar Products</h1>
            <ul className="similar-products-container">
              {similarProducts.map(eachProduct => (
                <SimilarProductItem
                  productDetails={eachProduct}
                  key={eachProduct.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div data-testid="loader" className="loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          className="error-img"
          alt="failure view"
        />
        <h1 className="error-title">Product Not Found</h1>
        <button
          type="button"
          className="error-button"
          onClick={this.onClickButton}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  render() {
    const {activeProduct, similarProducts, apiStatus} = this.state
    console.log(activeProduct)
    console.log(similarProducts)

    switch (apiStatus) {
      case apiStatusConstraints.success:
        return this.renderProductDetails()
      case apiStatusConstraints.failure:
        return this.renderFailureView()
      case apiStatusConstraints.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
