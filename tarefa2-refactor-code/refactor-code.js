class LegacyOrderProcessor {
  calculateDiscount(userInfo, subtotal) {
    var discount = 0;
    if (userInfo?.type == "VIP") {
      discount = subtotal * 0.15;
    } else if (userInfo?.type == "GOLD") {
      discount = subtotal * 0.10;
    } else if (userInfo?.type == "SILVER") {
      discount = subtotal * 0.05;
    } else if (userInfo?.type == "BRONZE") {
      discount = subtotal * 0.02;
    }
    return discount;
  }

  calculatePromo(promoInfo, subtotal) {
    var discount = 0;
    if (promoInfo?.code === "SAVE10") {
      discount = subtotal * 0.1;
    } else if (promoInfo?.code === "SAVE20") {
      discount = subtotal * 0.2;
    } else if (promoInfo?.code === "SAVE30") {
      discount = subtotal * 0.3;
    } else if (promoInfo?.code === "SAVE50") {
      discount = subtotal * 0.5;
    } else if (promoInfo?.code === "BOGO") {
      discount = subtotal * 0.5;
    }
    return discount
  }

  calculateShipping(shippingInfo) {
    var shipping = 0;
    if (shippingInfo.type === "EXPRESS") {
      shipping = 25;
    } else if (shippingInfo.type === "STANDARD") {
      shipping = 15;
    } else if (shippingInfo.type === "ECONOMY") {
      shipping = 8;
    }
    return shipping;
  }

  calculateTax(userInfo, subtotal, discount) {
    const total = subtotal - discount;
    var tax = 0;
    if (userInfo?.state === "CA") {
      tax = total * 0.0875;
    } else if (userInfo?.state === "NY") {
      tax = total * 0.08;
    } else if (userInfo?.state === "TX") {
      tax = total * 0.0625;
    } else if (userInfo?.state === "FL") {
      tax = 0;
    } else {
      tax = total * 0.05;
    }
    return tax;
  }

  calculatePaymentFree(paymentInfo, subtotal, discount) {
    const total = subtotal - discount;
    var payment = 0;
    if (paymentInfo?.method === "CREDIT_CARD") {
      paymentFee = total * 0.029;
    } else if (paymentInfo?.method === "DEBIT_CARD") {
      paymentFee = total * 0.015;
    } else if (paymentInfo?.method === "PAYPAL") {
      paymentFee = total * 0.034;
    } else if (paymentInfo?.method === "CRYPTO") {
      paymentFee = total * 0.01;
    }
    return payment;
  }

  sumCost(order) {
    var sum = 0;
    for (let j = 0; j < order.products.length; j++) {
      const product = order.products[j];
      if (product?.cost && product?.count) {
        sum += product.cost * product.count;
      }
    }
    return sum;
  }

  processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoInfo) {
    var subtotal = 0;
    var tax = 0;
    var shipping = 0;
    var discount = 0;
    var paymentFee = 0;
    var finalTotal = 0;

    subtotal = this.sumCost(orderData);
    discount = this.calculateDiscount(userInfo, subtotal) + this.calculatePromo(promoInfo, subtotal);
    tax = this.calculateTax(userInfo, subtotal, discount);
    shipping = this.calculateShipping(shippingInfo);
    paymentFee = this.calculatePaymentFree(paymentInfo, subtotal, discount);
    
    finalTotal = subtotal - discount + tax + shipping + paymentFee;

    return finalTotal;
  }

  validateProduct(item, inventory) {
    if (!item) {
      return "Item inválido";
    }

    if (!item.id) {
      return "ID do item não informado";
    }

    if (!item.quantity) {
      return "Quantidade não informada para item " + item.id;
    }

    if (item.quantity <= 0) {
      return "Quantidade inválida para item " + item.id;
    }

    if (!item.price) {
      return "Preço não informado para item " + item.id;
    }

    if (item.price <= 0) {
      return "Preço inválido para item " + item.id;
    }

    if (inventory?.checkStock && !inventory.checkStock(item.id, item.quantity)) {
      return "Item " + item.id + " não disponível";
    }

    return null;
  }

  validateUser(user) {
    if (!user) {
      return "Usuário não informado";
    } else if (!user.id) {
      return "ID do usuário não informado";
    } else if (!user.email) {
      return "Email do usuário não informado";
    } else if (!user.address) {
      return "Endereço do usuário não informado";
    }

    return null;
  }

  validatePayment(payment) {
    if (!payment) {
      return "Informações de pagamento não fornecidas";
    } else if (!payment.method) {
      return "Método de pagamento não informado";
    } else if (!payment.amount) {
      return "Valor do pagamento inválido";
    } else if (payment.amount <= 0) {
      return "Valor do pagamento não informado";
    }
    return null;
  }

  validateAndProcessOrder(order, user, payment, inventory) {
    var isValid = true;
    var errors = [];
    var result = {};

    if (!order) {
      errors.push("Pedido não informado");
      result.isValid = false;
      result.errors = errors;

      return result;
    }

    if (!order.items || order.items.length === 0) {
      errors.push("Pedido sem itens");
      result.isValid = false;
      result.errors = errors;

      return result;
    }

    for (var i = 0; i < order.items.length; i++) {
      const error = this.validateProduct(order.items[i], inventory);
      if (error) {
        errors.push(error);
        isValid = false;
      }
    }

    const invalidUserError = this.validateUser(user);
    if (invalidUserError) {
      errors.push(invalidUserError);
      isValid = false;
    }

    const invalidPaymentError = this.validatePayment(payment);
    if (invalidPaymentError) {
      errors.push(invalidPaymentError);
      isValid = false;
    }

    result.isValid = isValid;
    result.errors = errors;

    return result;
  }
}

module.exports = { LegacyOrderProcessor };