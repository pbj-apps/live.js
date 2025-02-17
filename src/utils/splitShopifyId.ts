export const splitShopifyId = (
  shopifyId: string,
): { type: string; id: string } => {
  // Example of Shopify Product Variant ID - "gid://shopify/ProductVariant/43714992668970"
  const [type, id] = shopifyId.split('ProductVariant/');
  return { type, id };
};
