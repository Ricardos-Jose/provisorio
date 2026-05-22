export class CheckoutFormData {
  /**
   * @param {Object} params
   * @param {string} params.firstName
   * @param {string} params.phone
   * @param {string} params.email
   * @param {string} params.cep
   * @param {string} params.city
   * @param {string} params.state
   * @param {string} params.address
   * @param {string} params.number
   * @param {string|null} [params.complement]
   * @param {string} params.paymentMethod
   * @param {number} params.deliveryFee
   * @param {string|null} [params.observations]
   */
  constructor({
    firstName,
    phone,
    email,
    cep,
    city,
    state,
    address,
    number,
    complement = null,
    paymentMethod,
    deliveryFee,
    observations = null,
  }) {
    this.firstName = firstName;
    this.phone = phone;
    this.email = email;

    this.cep = cep;
    this.city = city;
    this.state = state;
    this.address = address;
    this.number = number;
    this.complement = complement;

    this.paymentMethod = paymentMethod;
    this.deliveryFee = deliveryFee;
    this.observations = observations;
  }

  /**
   * @param {FormData} formData
   * @param {string} key
   * @returns {string}
   */
  static getRequired(formData, key) {
    const value = formData.get(key);

    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Missing required field: ${key}`);
    }

    return value.trim();
  }

  /**
   * @param {FormData} formData
   * @param {string} key
   * @returns {number}
   */
  static getRequiredNumber(formData, key) {
    const value = this.getRequired(formData, key);

    // Optional: support Brazilian decimal comma
    const normalized = value.replace(",", ".");

    const number = Number(normalized);

    if (Number.isNaN(number)) {
      throw new Error(`Field "${key}" must be a valid number`);
    }

    return number;
  }

  /**
   * @param {FormData} formData
   * @param {string} key
   * @returns {string|null}
   */
  static getOptional(formData, key) {
    const value = formData.get(key);

    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();

    return trimmed === "" ? null : trimmed;
  }

  /**
   * Creates DTO from FormData.
   *
   * @param {FormData} formData
   * @returns {CheckoutFormData}
   */
  static fromFormData(formData) {
    return new CheckoutFormData({
      firstName: this.getRequired(formData, "nome"),
      phone: this.getRequired(formData, "telefone"),
      email: this.getRequired(formData, "email"),

      cep: this.getRequired(formData, "cep"),
      city: this.getRequired(formData, "cidade"),
      state: this.getRequired(formData, "estado"),
      address: this.getRequired(formData, "endereco"),
      number: this.getRequired(formData, "numero"),

      paymentMethod: this.getRequired(formData, "pagamento"),
      deliveryFee: this.getRequiredNumber(formData, "taxaEntrega"),

      complement: this.getOptional(formData, "complemento"),
      observations: this.getOptional(formData, "observacoes"),
    });
  }
}
