module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName); // this not good practice to manupulate arguments,
    output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
    output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_ID%}/g, product.id);
    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); // this classname.
    }
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%PRODUCT_NUTRITION%}/g, product.nutrients);
    output = output.replace(/{%PRODUCT_DESC%}/g, product.description);
    return output;
}

// Note: module.export : export the current module, here we export anonymous function.