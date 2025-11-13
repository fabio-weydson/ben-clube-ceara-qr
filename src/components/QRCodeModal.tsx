import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Member } from "../types/member";

interface QRCodeModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {member.full_name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">Doc: {member.cpf_dni}</p>

          <div className="bg-gray-50 p-6 rounded-lg flex justify-center items-center">
            <QRCodeSVG value={member.qr_code_token} size={256} level="H" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-semibold ${
                  member.status === "active"
                    ? "text-green-600"
                    : member.status === "expired"
                    ? "text-red-600"
                    : member.status === "inactive"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {member.status.toUpperCase()}
              </span>
            </div>
            {member.expiration_date && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Validade:</span>
                <span className="text-gray-800">
                  {new Date(member.expiration_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              const canvas = document.querySelector("canvas");
              if (canvas) {
                const url = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = url;
                link.download = `qr-${member.full_name.replace(
                  /\s+/g,
                  "-"
                )}.png`;
                link.click();
              }
            }}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Baixar QR Code
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
