import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import toast from "react-hot-toast";

const SharePartnerLink: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const registrationLink = `https://crm.mntechs.com/partners/addpartners?builderId=${user?.id || ""}`;

  const message = encodeURIComponent(
    `Join as a Channel Partner!\nBuilder Name: ${user?.name || "N/A"}\nCompany Name: ${user?.company_name || "N/A"}\nRegister now: ${registrationLink}`
  );

  const whatsappLink = `https://wa.me/?text=${message}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `Join as a Channel Partner!\nBuilder Name: ${user?.name || "N/A"}\nCompany Name: ${user?.company_name || "N/A"}\nRegister now: ${registrationLink}`
    );
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-4">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#1c398e",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        WhatsApp
      </a>
      <button
        onClick={copyToClipboard}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#1c398e",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Copy
      </button>
    </div>
  );
};

export default SharePartnerLink;