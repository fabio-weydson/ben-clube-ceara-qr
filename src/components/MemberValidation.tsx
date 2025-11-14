import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Member } from "../types/member";
import { getStatusBadgeClass, getStatusLabel } from "../utils/statusUtils";

const MemberValidation: React.FC = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          setError("Token não fornecido na URL");
          setLoading(false);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from("members")
          .select("*")
          .eq("id", token)
          .maybeSingle();

        if (supabaseError) {
          setError("Membro não encontrado");
          setLoading(false);
          return;
        }

        await supabase.from("qr_scans").insert({
          member_id: data.id,
        });

        setMember(data);
      } catch (err) {
        setError("Erro ao buscar informações do membro");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-primary-700 font-medium">
              Verificando cadastro...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Cadastro não encontrado
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isExpired =
    member.expiration_date && new Date(member.expiration_date) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-primary-700 mb-1">
            BEN CLUBE - CEARÁ
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Validação de Cadastro
          </h2>
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getStatusBadgeClass(
              member.status
            )}`}
            title={`Status: ${getStatusLabel(member.status)}`}
          >
            <span className="font-semibold text-sm uppercase tracking-wide">
              {getStatusLabel(member.status)}
            </span>
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Nome Completo
            </label>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {member.full_name}
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              CPF/DNI
            </label>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {member.cpf_dni}
            </p>
          </div>

          {member.birth_date && (
            <div className="border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Data de Nascimento
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {formatDate(member.birth_date)}
              </p>
            </div>
          )}

          {member.phone && (
            <div className="border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Telefone
              </label>
              <p className="text-lg text-gray-800 mt-1">{member.phone}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Data de Adesão
              </label>
              <p className="text-base font-semibold text-gray-800 mt-1">
                {formatDate(member.join_date)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Validade
              </label>
              <p
                className={`text-base font-semibold mt-1 ${
                  isExpired ? "text-red-600" : "text-gray-800"
                }`}
              >
                {formatDate(member.expiration_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Validado em {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberValidation;
