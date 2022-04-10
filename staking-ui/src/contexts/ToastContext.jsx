import React, { useCallback, useEffect, useState, createContext } from "react";

const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => setToasts((ts) => ts.slice(1)), 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const addToast = useCallback(
    (toast) => {
      setToasts((ts) => [...ts, toast]);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.map((toast, index) => (
        <button
          key={index}
          onClick={() => {
            window.open(toast.link, "_blank");
          }}
          disabled={!toast.link}
          style={{
            cursor: !toast.link ? "default" : "pointer",
            position: "fixed",
            bottom: 24,
            right: 24,
            backgroundColor: toast.isError ? "#D22B2B" : "#1BD909",
            color: "white",
            margin: 5,
            padding: 15,
            zIndex: 99,
            width: 300,
            wordWrap: "break-word",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 24, marginBottom: 5 }}>
            {toast.title}
          </div>
          <div style={{ fontSize: 16 }}>{toast.message}</div>
        </button>
      ))}
    </ToastContext.Provider>
  );
};

export default ToastContext;
