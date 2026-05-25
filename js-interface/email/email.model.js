/**
 * Product information used in e-mail templates.
 */
export class ProductMailInfo {
  /**
   * @param {string} name - Product name.
   * @param {number} quantity - Quantity purchased.
   * @param {number} subtotal - Product subtotal price.
   */
  constructor(name, quantity, subtotal) {
    /** @type {string} */
    this.name = name;

    /** @type {number} */
    this.quantity = quantity;

    /** @type {number} */
    this.subtotal = subtotal;
  }
}

/**
 * Delivery address information used in e-mail templates.
 */
export class AddressMailInfo {
  /**
   * @param {Object} params
   * @param {string} params.cep - ZIP/CEP code.
   * @param {string} params.state - State abbreviation or name.
   * @param {string} params.city - City name.
   * @param {string} params.street - Street address.
   * @param {string|number} params.number - House/building number.
   * @param {string|null} [params.complement=null] - Address complement.
   */
  constructor({ cep, state, city, street: street, number, complement = null }) {
    /** @type {string} */
    this.cep = cep;

    /** @type {string} */
    this.state = state;

    /** @type {string} */
    this.city = city;

    /** @type {string} */
    this.street = street;

    /** @type {string|number} */
    this.number = number;

    /** @type {string|null} */
    this.complement = complement;
  }
}

/**
 * Complete order information used for e-mail sending.
 */
export class MailInfo {
  /**
   * @param {Object} params
   * @param {string} params.email - Customer e-mail address.
   * @param {string} params.firstName - Customer first name.
   * @param {string} params.phone - Customer phone number.
   * @param {string} params.paymentMethod - Selected payment method.
   * @param {number} params.productsTotal - Order total amount excluding fees.
   * @param {number} params.deliveryFee - Order delivery fee amount.
   * @param {number} params.total - Order total amount.
   * @param {ProductMailInfo[]} [params.products=[]] - Purchased products.
   * @param {AddressMailInfo} params.address - Delivery address.
   */
  constructor({
    email,
    firstName,
    phone,
    paymentMethod,
    deliveryFee,
    productsTotal,
    total,
    products = [],
    address,
  }) {
    /** @type {string} */
    this.email = email;

    /** @type {string} */
    this.first_name = firstName;

    /** @type {string} */
    this.phone = phone;

    /** @type {string} */
    this.payment_method = paymentMethod;

    /** @type {number} */
    this.total = total;

    /** @type {number} */
    this.products_total = productsTotal;

    /** @type {number} */
    this.delivery_fee = deliveryFee;

    /** @type {ProductMailInfo[]} */
    this.products = products;

    /** @type {AddressMailInfo} */
    this.address = address;

    // Flattened fields for EmailJS template access

    /** @type {string|undefined} */
    this.cep = address?.cep;

    /** @type {string|undefined} */
    this.state = address?.state;

    /** @type {string|undefined} */
    this.city = address?.city;

    /** @type {string|undefined} */
    this.street = address?.street;

    /** @type {string|number|undefined} */
    this.number = address?.number;

    /** @type {string|null|undefined} */
    this.complement = address?.complement;
  }
}

export class MailService {
  // Utilizar Base64 para armazenar os valores
  static SERVICE_ID = atob("c2VydmljZV91aWR4MHc0");
  static USER_ID = atob("NlhTTGR0bTNRVF9fWm45cnU=");
  static TEMPLATE_ID = "template_vmha5nm";
  static SERVICE_URL = "https://api.emailjs.com/api/v1.0/email/send";

  /**
   * @param {MailInfo} mailInfo
   */
  async send(mailInfo) {
    const response = await fetch(MailService.SERVICE_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        service_id: MailService.SERVICE_ID,
        template_id: MailService.TEMPLATE_ID,
        user_id: MailService.USER_ID,

        template_params: {
          ...mailInfo,
          to_email: mailInfo.email,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `MailService request failed: ${response.status} ${errorText}`,
      );
    }

    return response;
  }
}

export class MockMailService extends MailService {
  /**
   * @param {MailInfo} mailInfo
   */
  async send(mailInfo) {
    return new Promise((resolve) => {
      console.debug(`Sending mail with info:`);
      console.dir(mailInfo);
      debugger;
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
}
