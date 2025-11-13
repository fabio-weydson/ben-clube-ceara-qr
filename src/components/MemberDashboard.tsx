import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Member } from "../types/member";

const MemberDashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    cpf_dni: "",
    email: "",
    phone: "",
    address: "",
    birth_date: "",
    expiration_date: "",
  });

  const [affiliates, setAffiliates] = useState<
    Omit<
      Member,
      | "id"
      | "owner_id"
      | "created_at"
      | "updated_at"
      | "address"
      | "birth_date"
      | "expiration_date"
      | "join_date"
      | "status"
    >[]
  >([]);
  const [currentAffiliate, setCurrentAffiliate] = useState({
    full_name: "",
    cpf_dni: "",
    phone: "",
    email: "",
    member_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    message?: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAffiliateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAffiliate({
      ...currentAffiliate,
      [e.target.name]: e.target.value,
    });
  };

  const addAffiliate = () => {
    if (!currentAffiliate.full_name || !currentAffiliate.cpf_dni) {
      setMessage({
        type: "error",
        text: "Nome do dependente e CPF/DNI são obrigatórios",
      });
      return;
    }
    setAffiliates([...affiliates, currentAffiliate]);
    setCurrentAffiliate({
      full_name: "",
      cpf_dni: "",
      phone: "",
      email: "",
      member_type: "affiliate",
    });
  };

  const removeAffiliate = (index: number) => {
    setAffiliates(affiliates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: member, error: memberError } = await supabase
        .from("members")
        .insert([
          {
            ...formData,
            member_type: "owner",
            status: "active",
          },
        ])
        .select()
        .single();

      if (memberError) throw memberError;

      if (affiliates.length > 0 && member) {
        const affiliatesData = affiliates.map((aff) => ({
          ...aff,
          owner_id: member.id,
          member_type: "affiliate",
          status: "active",
        }));

        const { error: affiliatesError } = await supabase
          .from("members")
          .insert(affiliatesData);

        if (affiliatesError) {
          await supabase.from("members").delete().eq("id", member.id);
          throw affiliatesError;
        }
      }

      setMessage({ type: "success", text: "Membro adicionado com sucesso!" });
      setFormData({
        full_name: "",
        cpf_dni: "",
        email: "",
        phone: "",
        address: "",
        birth_date: "",
        expiration_date: "",
      });
      setAffiliates([]);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Falha ao adicionar membro",
        message: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Novo membro</h1>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
              title={message.message}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF/DNI *
                </label>
                <input
                  type="text"
                  name="cpf_dni"
                  value={formData.cpf_dni}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de expiração
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Dependentes
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Nome completo"
                    value={currentAffiliate.full_name}
                    onChange={handleAffiliateChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="cpf_dni"
                    placeholder="CPF/DNI"
                    value={currentAffiliate.cpf_dni}
                    onChange={handleAffiliateChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={currentAffiliate.phone}
                    onChange={handleAffiliateChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={currentAffiliate.email}
                    onChange={handleAffiliateChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAffiliate}
                  className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Adicionar Dependente
                </button>
              </div>

              {affiliates.length > 0 && (
                <div className="space-y-2">
                  {affiliates.map((affiliate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{affiliate.full_name}</div>
                        <div className="text-sm text-gray-500">
                          {affiliate.cpf_dni} • {affiliate.phone} •{" "}
                          {affiliate.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAffiliate(index)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Adicionando Membro..." : "Adicionar Membro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
