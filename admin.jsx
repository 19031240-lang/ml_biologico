// Botones para recursos externos de Machine Learning con mas información y enlaces a sitios web relevantes muy importantes para el aprendizaje de Machine Learning, como TensorFlow, GNU Octave, Jupyter, entre otros. Estos botones están diseñados para ser atractivos y fáciles de usar, con un estilo moderno y una funcionalidad que permite abrir los enlaces en una nueva pestaña del navegador.
import React from "react";

function SeccionMLExternos() {
  const botones = [
    { texto: "Fundamentos de Machine Learning", url: "https://developers.google.com/machine-learning/crash-course" },
    { texto: "Entrenamiento", url: "https://scikit-learn.org/stable/supervised_learning.html" },
    { texto: "Validación", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    { texto: "TensorFlow", url: "https://www.tensorflow.org" },
    { texto: "GNU Octave", url: "https://www.gnu.org/software/octave/" },
    { texto: "Jupyter", url: "https://jupyter.org" },
    { texto: "GNU Project", url: "https://www.gnu.org" },
  ];

  const estiloBoton = {
    backgroundColor: "#2ecc71", // verde
    color: "#fff",              // texto blanco
    border: "none",
    padding: "12px 20px",
    margin: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  };

  const estiloContenedor = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  };

  return (
    <div>
      <h2>Sección de Machine Learning</h2>
      <div style={estiloContenedor}>
        {botones.map((btn, index) => (
          <button
            key={index}
            style={estiloBoton}
            onClick={() => window.open(btn.url, "_blank")}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#27ae60")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2ecc71")}
          >
            {btn.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeccionMLExternos;
