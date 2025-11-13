const getAddressByCep = async (cep: string) => {
  try {
    const cleanedCep = cep.replace(/\D/g, "");
    const response = await fetch(
      `https://viacep.com.br/ws/${cleanedCep}/json/`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar o CEP");
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return {
      address: data.logradouro,
      district: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error);
    return null;
  }
};

export default getAddressByCep;
