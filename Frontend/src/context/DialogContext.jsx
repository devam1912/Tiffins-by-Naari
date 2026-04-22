import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const DialogContext = createContext();

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert", // 'alert' or 'confirm'
    resolve: null,
  });

  const showAlert = useCallback((title, message) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        type: "alert",
        resolve,
      });
    });
  }, []);

  const showConfirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        type: "confirm",
        resolve,
      });
    });
  }, []);

  const closeDialog = (value) => {
    if (dialog.resolve) {
      dialog.resolve(value);
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {dialog.isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dialog.type === "alert" && closeDialog(true)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(15, 25, 15, 0.4)",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "#fff",
                borderRadius: "32px",
                padding: "40px",
                maxWidth: "400px",
                width: "100%",
                position: "relative",
                boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
                textAlign: "center",
              }}
            >
              <div 
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "20px", 
                  background: dialog.type === 'confirm' ? "linear-gradient(135deg, #8FAE8E, #8FA873)" : "linear-gradient(135deg, #FFB74D, #FFA726)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 24px",
                  fontSize: "28px",
                  color: "#fff"
                }}
              >
                {dialog.type === 'confirm' ? "❔" : "⚠️"}
              </div>

              <h2 style={{ fontFamily: "'Lora', serif", fontSize: "24px", fontWeight: 700, color: "#2d3b2d", marginBottom: "12px" }}>
                {dialog.title}
              </h2>
              <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
                {dialog.message}
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                {dialog.type === "confirm" ? (
                  <>
                    <button
                      onClick={() => closeDialog(false)}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "#f5f5f0",
                        border: "none",
                        borderRadius: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        color: "#888",
                        fontFamily: "'Nunito', sans-serif",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#eeeeee")}
                      onMouseLeave={(e) => (e.target.style.background = "#f5f5f0")}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => closeDialog(true)}
                      style={{
                        flex: 1,
                        padding: "14px",
                        background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "16px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                        boxShadow: "0 8px 20px rgba(143, 174, 142, 0.3)",
                      }}
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => closeDialog(true)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(135deg, #8FAE8E, #8FA873)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    OK
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
