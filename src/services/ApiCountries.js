import axios from "axios";

export const url = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});

// Exporta requisição que obtém todos os países
export async function getAll(complementaryURL) {
  return await url.get(complementaryURL).then((resp) => {
    return resp.data;
  }).catch((error) => {
    return error.message
  });
}

// Exporta requisição que obtém os países de uma região específica
export async function getByRegion(complementaryURL) {
  return await url.get(complementaryURL).then((resp) => {
    return resp.data;
  }).catch((error) => {
    return error.message
  });
}

// Exporta função para obter os detalhes do país pelo nome
export async function getByName(complementaryURL) {
  return await url.get(complementaryURL).then((resp) => {
    return resp?.data[0];
  }).catch((error) => {
    return error?.message
  });
}

// Exporta função para obter os países pelos códigos alfa dos países vizinhos
export async function getByAlphaCode(complementaryURL) {
  return await url.get(complementaryURL).then((resp) => {
    return resp.data;
  }).catch((error) => {
    return error.message
  });
}
