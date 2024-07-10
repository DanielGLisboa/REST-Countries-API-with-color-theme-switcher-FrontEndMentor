import * as ApiCountries from "../../services/ApiCountries";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const MOCK_BASE_URL = new MockAdapter(axios);

describe("Testes do serviço ApiCountries", () => {
  afterEach(() => {
    MOCK_BASE_URL.reset();
  });

  it("Deve retornar o resp com todos os paises (getAll)", async () => {
    MOCK_BASE_URL.onGet("/all").reply(200);
    const data = await ApiCountries.getAll("/all");
    expect(data).toEqual(data);
  });

  it("Deve retornar mensagem de erro (getAll)", async () => {
    MOCK_BASE_URL.onGet("/al").reply(404);
    const data = await ApiCountries.getAll("/al");
    expect(data).toEqual(data);
  });

  it("Deve retornar o resp com os paises filtrados (getByRegion)", async () => {
    MOCK_BASE_URL.onGet(`/region/europe`).reply(200);
    const data = await ApiCountries.getByRegion(`/region/europe`);
    expect(data).toEqual(data);
  });

  it("Deve retornar mensagem de erro (getByRegion)", async () => {
    MOCK_BASE_URL.onGet(`/regio/europe`).reply(404);
    const data = await ApiCountries.getByRegion("/regio/europe");
    expect(data).toEqual(data);
  });

  it("Deve retornar o resp com um pais (getByName)", async () => {
    MOCK_BASE_URL.onGet(`/name/Brazil`).reply(200);
    const data = await ApiCountries.getByName(`/name/Brazil`);
    expect(data).toEqual(data);
  });

  it("Deve retornar mensagem de erro (getByName)", async () => {
    MOCK_BASE_URL.onGet(`/nam/Brazil`).reply(404);
    const data = await ApiCountries.getByName(`/nam/Brazil`);
    expect(data).toEqual(data);
  });

  it("Deve retornar o resp com um pais (getByAlphaCode)", async () => {
    MOCK_BASE_URL.onGet(`/alpha?codes=BRA`).reply(200);
    const data = await ApiCountries.getByAlphaCode(`/alpha?codes=BRA`);
    expect(data).toEqual(data);
  });

  it("Deve retornar mensagem de erro (getByAlphaCode)", async () => {
    MOCK_BASE_URL.onGet(`/alph?codes=BRA`).reply(404);
    const data = await ApiCountries.getByAlphaCode(`/alph?codes=BRA`);
    expect(data).toEqual(data);
  });
});
