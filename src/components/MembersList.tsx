import React, { useState, useEffect } from "react";
import { Member } from "../types/member";
import { supabase } from "../lib/supabase";
import QRCodeModal from "./QRCodeModal";
import { getStatusBadgeClass, getStatusLabel } from "../utils/statusUtils";

const MembersList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .order("full_name", { ascending: true });

      if (fetchError) throw fetchError;

      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const handleShowQRCode = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.cpf_dni.includes(searchTerm) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando membros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Erro</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchMembers}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lista de Membros
            </h1>
            <p className="text-gray-600">Total de membros: {members.length}</p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou CPF/DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiração
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Nenhum membro encontrado
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.cpf_dni}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {member.email || "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.phone || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                            member.status
                          )}`}
                          title={`Status: ${getStatusLabel(member.status)}`}
                        >
                          {getStatusLabel(member.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {member.expiration_date
                          ? new Date(
                              member.expiration_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleShowQRCode(member)}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                        >
                          Exibir QR Code
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <QRCodeModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MembersList;
