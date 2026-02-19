import React from "react";
import { useNavigate } from "react-router-dom";

const SavedResources = () => {
  const navigate = useNavigate();

  const resources = [
    {
      id: 1,
      title: "National Legal Aid Support",
      description:
        "Free legal assistance for vulnerable individuals facing injustice.",
      link: "https://nalsa.gov.in/",
    },
    {
      id: 2,
      title: "Women Helpline (181)",
      description:
        "24/7 emergency support for women in distress situations.",
      link: "https://wcd.nic.in/",
    },
    {
      id: 3,
      title: "Mental Health Support",
      description:
        "Confidential counseling and emotional support services.",
      link: "https://www.mohfw.gov.in/",
    },
  ];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Saved Resources</h2>
      <p style={{ opacity: 0.7 }}>
        Quick access to important verified support resources.
      </p>

      <div style={{ marginTop: "20px" }}>
        {resources.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1e1e2f",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "15px",
            }}
          >
            <h3>{item.title}</h3>
            <p style={{ opacity: 0.8 }}>{item.description}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#4ade80",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Open Resource →
            </a>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/profile")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        Back to Profile
      </button>
    </div>
  );
};

export default SavedResources;
