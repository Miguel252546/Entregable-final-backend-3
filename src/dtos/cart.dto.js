export class CartDTO {
    constructor(cart, total = 0) {
        this._id = cart._id;
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            productId: item.product?._id || item.product,
            title: item.product?.title,
            quantity: item.quantity,
            price: item.product?.price,
            subtotal: item.product ? item.product.price * item.quantity : 0
        }));
        this.total = total;
    }
}

export class CreateCartDTO {
    constructor(data) {
        this.products = data.products || [];
    }
}
