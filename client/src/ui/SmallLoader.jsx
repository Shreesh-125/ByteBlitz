import { Loader2 } from "lucide-react";
import React from "react";

function SmallLoader() {
  return (
    <div>
      <Loader2
        style={{
          animation: "spin 1s linear infinite", // Apply the spin animation
        }}
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default SmallLoader;
