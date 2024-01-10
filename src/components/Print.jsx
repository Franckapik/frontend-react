import React from "react";

export const Print = () => (
  <div className="printbutton has-text-centered m-3">
    <button onClick={() => window.print()}>Imprimer</button>
    <style>{`@media print {.printbutton{display: none;}}`}</style>
  </div>
);
