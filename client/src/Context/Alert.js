import React, { useState, createContext } from "react";
export const alertContext = createContext();

const Alert = ({ children }) => {
  const [alertState, toggleAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [textAlert, setTextAlert] = useState("");

  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <alertContext.Provider
      value={{
        showAlert: (text,type) => {
          toggleAlert(true);
          setTextAlert(text);
          setAlertType(type);

          setTimeout(() => {
            toggleAlert(false);
            setTextAlert("");
            setAlertType("")
          }, 2000);
        },
      }}
    >
      {children}
      {alertState && (
            <div
              className={`alert-container alert alert-${alertType} alert-dismissible fade show p-2 m-2`}
              role="alert"
              style={{ position:"fixed", top:"50px", right:"50px", height: "40px"}}
            >
              <strong>{capitalize(alertType)}</strong>: {textAlert}
            </div>
      )}
    </alertContext.Provider>
  );
};

export default Alert;
