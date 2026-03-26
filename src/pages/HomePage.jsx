import { Box, Typography } from "@mui/material";
import { HOME_CARDS } from "../constants/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function HomePage({ onNavigate }) {
  const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

  return (
    <Box
      sx={{ p: "30px 28px", overflowY: "auto", height: "calc(100vh - 56px)" }}
    >
      {/* Hero */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h1" sx={{ fontSize: 32, mb: 1, lineHeight: 1.2 }}>
          Smart{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #34d399, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Financial
          </Box>
          <br />
          Calculators
        </Typography>
        <Typography
          sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.7 }}
        >
          Plan loans, taxes, investments & GST in seconds. No sign-up. No
          guesswork. Just accurate numbers.
        </Typography>
      </Box>

      {/* Cards Grid */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile (0px → 600px)
            sm: "repeat(2, 1fr)", // tablet
            md: "repeat(3, 1fr)", // desktop
          },
          gap: "14px",
        }}
      >
        {HOME_CARDS.map((card) => {
          const isHovered = hoveredCard === card.id;
          return (
            <Box
              key={card.id}
              onClick={() => navigate(`/${card.id}`)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                /* ── Base card — dark, no gradient, clean border ── */
                background: "#0f1018",
                border: `1px solid ${isHovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "16px",
                padding: "22px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.2s ease, transform 0.2s ease",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",

                /* subtle top accent line on hover only */
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: `linear-gradient(90deg, ${card.arrowColor}, transparent)`,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.2s ease",
                },
              }}
            >
              {/* Icon box */}
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "12px",
                  background: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  mb: 1.75,
                }}
              >
                {card.icon}
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 15.5,
                  fontWeight: 700,
                  color: "#eef0fa",
                  mb: 0.75,
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: "#8b8fa8",
                  lineHeight: 1.65,
                  mb: 1.5,
                  pr: 3 /* leave room so text doesn't sit under arrow */,
                }}
              >
                {card.desc}
              </Typography>

              {/* Tag pill */}
              <Box
                sx={{
                  display: "inline-block",
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  px: 1,
                  py: 0.375,
                  borderRadius: "8px",
                  background: card.tagBg,
                  color: card.tagColor,
                }}
              >
                {card.tag}
              </Box>

              {/* Arrow */}
              <Typography
                sx={{
                  position: "absolute",
                  right: 18,
                  bottom: 18,
                  fontSize: 16,
                  color: card.arrowColor,
                  transition: "transform 0.2s ease",
                  transform: isHovered ? "translateX(3px)" : "translateX(0)",
                }}
              >
                →
              </Typography>
            </Box>
          );
        })}

        {/* ── Coming Soon (greyed out, no interaction) ── */}
        <Box
          sx={{
            background:
              "repeating-linear-gradient(45deg, #0f1018, #0f1018 10px, #131620 10px, #131620 20px)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            padding: "22px",
            opacity: 0.45,
            cursor: "default",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#1a1d2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              mb: 1.75,
            }}
          >
            ⏳
          </Box>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15.5,
              fontWeight: 700,
              color: "#eef0fa",
              mb: 0.75,
            }}
          >
            More Coming Soon
          </Typography>
          <Typography
            sx={{ fontSize: 12.5, color: "#8b8fa8", lineHeight: 1.65, mb: 1.5 }}
          >
            PPF, FD, NPS, HRA, Compound Interest & more launching soon.
          </Typography>
          <Box
            sx={{
              display: "inline-block",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.6px",
              px: 1,
              py: 0.375,
              borderRadius: "8px",
              background: "#1a1d2e",
              color: "#4e5168",
            }}
          >
            SOON
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
