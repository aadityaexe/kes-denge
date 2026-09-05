import { ImageResponse } from "next/og";

export const alt = "MARK Technologies — We Build Digital Products That Scale";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: "#09090c",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(201, 169, 110, 0.2) 0%, transparent 65%)",
          border: "1px solid rgba(201, 169, 110, 0.25)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top bar: Brand + Status badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "#a1a1aa",
                textTransform: "uppercase",
              }}
            >
              mark2.in • Digital Product Engineering
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(201, 169, 110, 0.12)",
              border: "1px solid rgba(201, 169, 110, 0.3)",
              color: "#C9A96E",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            BESPOKE SOFTWARE
          </div>
        </div>

        {/* Center: Main title & elevator pitch */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "76px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              M<span style={{ color: "#C9A96E", fontStyle: "italic" }}>ARK</span>
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#e4e4e7",
                textTransform: "uppercase",
              }}
            >
              TECHNOLOGIES
            </span>
          </div>

          <p
            style={{
              fontSize: "32px",
              fontWeight: 500,
              color: "#d4d4d8",
              lineHeight: 1.35,
              maxWidth: "960px",
              margin: 0,
            }}
          >
            We build digital products that scale. Web apps, mobile applications, enterprise ERP, and AI automation.
          </p>
        </div>

        {/* Bottom bar: Capability chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "28px",
          }}
        >
          {[
            "High-Throughput Web Apps",
            "Mobile Applications",
            "Enterprise Cloud ERP",
            "AI Automation Systems",
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#d4d4d8",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
