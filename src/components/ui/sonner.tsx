import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style>{`
        [data-sonner-toast][data-type="success"] {
          background-color: #f0fdf4 !important;
          color: #166534 !important;
          border: 1px solid #bbf7d0 !important;
        }
        [data-sonner-toast][data-type="error"] {
          background-color: #fef2f2 !important;
          color: #991b1b !important;
          border: 1px solid #fecaca !important;
        }
        [data-sonner-toast] {
          position: relative !important;
          padding-right: 2.75rem !important;
          overflow: visible !important;
        }
        [data-sonner-toast] > div {
          position: relative !important;
        }
        [data-sonner-toast] [data-button-wrapper],
        [data-sonner-toast] [data-close-button],
        [data-sonner-toast] button[aria-label*="close" i],
        [data-sonner-toast] button[data-close-button],
        [data-sonner-toast] .sonner-button,
        [data-sonner-toast] button[title*="close" i] {
          position: absolute !important;
          top: 0.5rem !important;
          right: 0.5rem !important;
          left: auto !important;
          bottom: auto !important;
          margin: 0 !important;
          padding: 0.375rem !important;
          z-index: 10 !important;
          transform: none !important;
          background: transparent !important;
          border: none !important;
          font-size: 1.25rem !important;
          width: 1.5rem !important;
          height: 1.5rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        [data-sonner-toast][data-type="success"] button[aria-label*="close" i],
        [data-sonner-toast][data-type="success"] [data-close-button],
        [data-sonner-toast][data-type="success"] button[data-close-button] {
          color: #166534 !important;
        }
        [data-sonner-toast][data-type="error"] button[aria-label*="close" i],
        [data-sonner-toast][data-type="error"] [data-close-button],
        [data-sonner-toast][data-type="error"] button[data-close-button] {
          color: #991b1b !important;
        }
        [data-sonner-toast] button[aria-label*="close" i]:hover {
          opacity: 0.7 !important;
        }
        [data-sonner-toaster] {
          overflow: visible !important;
        }
        [data-sonner-toaster][data-position="top-right"] {
          right: 0.5rem !important;
        }
      `}</style>
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        position="top-right"
        closeButton
        preventDuplicates
        toastOptions={{
          classNames: {
            success: "bg-green-50 border-green-200 text-green-800",
            error: "bg-red-50 border-red-200 text-red-800",
          },
        }}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  );
};

export { Toaster };
