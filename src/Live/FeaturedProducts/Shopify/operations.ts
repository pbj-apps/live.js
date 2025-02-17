// Mutations
export const createCartMutation = `mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
}`;

export const addLineItemsMutation = ({ cartId, selectedVariantId, quantity }) =>
  `mutation addToCart {
    cartLinesAdd(cartId: "${cartId}", 
    lines: {
      merchandiseId: "${selectedVariantId}", 
      quantity: ${quantity}
    }) {
      userErrors {
        field
        message
      }
      cart {
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }`;

export const removeLineItemsMutation = ({ cartId, lineId }) => `
  mutation cartLinesRemove {
    cartLinesRemove(
      cartId: "${cartId}"
      lineIds: "${lineId}"
    ) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
              quantity
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Queries
export const getProductQuery = ({ id }) => `query ProductQuery {
  product(id: "gid://shopify/Product/${id}") {
    id
    availableForSale
    description
    handle
    title
    options {
      name
      values
    }
    variants(first: 100) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        price {
          amount
          currencyCode
        }
        availableForSale
        sku
        image {
          id
          url
          altText
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
}
`;

export const getCartQuery = ({ cartId }) => `query {
  cart(
    id: "${cartId}"
  ) {
    id
    createdAt
    updatedAt
    checkoutUrl
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
  }
}`;
