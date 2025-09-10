# Headless WooCommerce Client

Client for Headless WooCommerce Wordpress Plugin

## Installation

1. Install [HeadlessWC: Ultimate eCommerce Decoupler](https://wordpress.org/plugins/headless-wc/) WordPress plugin on your site
2. Install this package

```sh
npm install headless-wc-client
```

3. Done!

## Examples

1. Geting all WooCommerce products in React

```js
const headlessWC = new HeadlessWC("https://example-wc-site.com");
const products = await headlessWC.getProducts();
return (
  <>
    {products.map((product) => (
      <div>
        <img src={product.image.full} alt="" />
        <h3>Name: {product.name}</h3>
        <p>Price: {product.price}</p>
        <h4>Short description:</h4>
        <div
          dangerouslySetInnerHTML={{
            __html: product.shortDescription.rendered,
          }}
        />
      </div>
    ))}
  </>
);
```
