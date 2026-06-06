export class TicketDTO {
    constructor(ticket) {
        this._id = ticket._id;
        this.id = ticket._id;
        this.code = ticket.code;
        this.purchaseDatetime = ticket.purchase_datetime;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.products = ticket.products;
        this.failedProducts = ticket.failedProducts;
        this.status = ticket.status;
    }
}

export class PurchaseResultDTO {
    constructor(ticket) {
        this.ticket = ticket._id;
        this.code = ticket.code;
        this.amount = ticket.amount;
        this.products = ticket.products.length;
        this.failedProducts = ticket.failedProducts.length;
        this.status = ticket.status;
    }
}
