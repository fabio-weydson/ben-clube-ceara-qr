const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Ativo";
    case "inactive":
      return "Inativo";
    case "pending":
      return "Pendente";
    case "expired":
      return "Expirado";
    default:
      return status;
  }
};

export { getStatusLabel, getStatusBadgeClass };
