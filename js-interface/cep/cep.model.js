/**
 * Address data returned from CEP lookup.
 */
export class Address {
  /**
   * @param {Object} params
   * @param {string|null} params.cep
   * @param {string|null} params.state
   * @param {string|null} params.city
   * @param {string|null} params.neighborhood
   * @param {string|null} params.street
   * @param {string|null} params.complement
   */
  constructor({ cep, state, city, neighborhood, street, complement }) {
    /** @type {string|null} */
    this.cep = cep;

    /** @type {string|null} */
    this.state = state;

    /** @type {string|null} */
    this.city = city;

    /** @type {string|null} */
    this.neighborhood = neighborhood;

    /** @type {string|null} */
    this.street = street;

    /** @type {string|null} */
    this.complement = complement;
  }

  toString() {
    const streetLine = [this.street, this.complement && `(${this.complement})`]
      .filter(Boolean)
      .join(" ");

    const parts = [
      streetLine,
      this.neighborhood,
      this.city,
      this.state,
      this.cep,
    ];

    return parts.filter(Boolean).join(", ");
  }
}

export class CepAPI {
  #url(cep) {
    return `https://brasilapi.com.br/api/cep/v2/${cep}`;
  }

  #sanitizeCep(cep) {
    return cep.replace(/\D/g, "");
  }

  /**
   * Uses API to convert CEP into address
   * @param {string} cep
   * @returns {Promise<Address>}
   */
  async fetchAddress(cep) {
    const sanitizedCep = this.#sanitizeCep(cep);

    if (sanitizedCep.length !== 8) {
      throw new Error("CEP inválido");
    }

    try {
      const response = await fetch(this.#url(sanitizedCep));

      if (!response.ok) {
        throw new Error(
          "BrasilAPI returned error:",
          response.status,
          response.statusText,
        );
      }

      const data = await response.json();

      return new Address({
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
      });
    } catch (err) {
      throw new Error("Failed to fetch CEP:", err);
    }
  }
}
