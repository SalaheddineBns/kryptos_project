import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Fade,
  Avatar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { question: string; response: string; recommendation?: string }[]
  >([]);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("http://localhost:8888/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      console.log(data);

      const combinedAnswer = [data.response, data.recommendation]
        .filter(Boolean)
        .join("\n\n");

      setAnswer(combinedAnswer || "Aucune réponse trouvée.");
      setHistory((prev) => [...prev, { question, response: combinedAnswer }]);

      setQuestion("");
    } catch (e) {
      setAnswer("Erreur lors de la communication avec le chatbot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 2000 }}>
      <Fade in={!open} unmountOnExit>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Paper
            sx={{
              px: 2,
              py: 1,
              bgcolor: "#23272f",
              color: "#fff",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Comment puis-je vous aider ?
            </Typography>
          </Paper>
          <IconButton
            color="primary"
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "#23272f",
              color: "#fff",
              boxShadow: 3,
              width: 56,
              height: 56,
            }}
          >
            <ChatIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Fade>
      <Fade in={open} unmountOnExit>
        <Paper
          sx={{
            p: 2,
            width: 350,
            height: 420,
            boxShadow: 6,
            bgcolor: "#181c24",
            color: "#fff",
            borderRadius: 4,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{
              color: "#fff",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
              <ChatIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              CryptoBot
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: "100%",
              overflowY: "auto",
              mb: 2,
            }}
          >
            {history.length === 0 && (
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Posez-moi une question sur la crypto !
              </Typography>
            )}
            {history.map((item, idx) => (
              <Box key={idx} mb={2}>
                {/* Question utilisateur */}
                <Box
                  display="flex"
                  alignItems="flex-end"
                  gap={1}
                  mb={0.5}
                  justifyContent="flex-end"
                >
                  <Paper
                    sx={{
                      bgcolor: "#1976d2",
                      color: "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      maxWidth: 220,
                      boxShadow: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.question}
                    </Typography>
                  </Paper>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "#23272f",
                      fontSize: 14,
                    }}
                  >
                    Vous
                  </Avatar>
                </Box>
                {/* Réponse bot */}
                <Box
                  display="flex"
                  alignItems="flex-start"
                  gap={1}
                  mb={0.5}
                  justifyContent="flex-start"
                >
                  <Avatar sx={{ width: 24, height: 24, bgcolor: "#1976d2" }}>
                    <ChatIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Paper
                    sx={{
                      bgcolor: "#23272f",
                      color: "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      maxWidth: 260,
                      boxShadow: 2,
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                        textAlign: "left",
                        m: 0,
                      }}
                    >
                      {item.response}
                    </Typography>
                    {item.recommendation && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#90caf9",
                          whiteSpace: "pre-line",
                          mt: 1,
                          fontSize: "0.97em",
                          wordBreak: "break-word",
                          textAlign: "left",
                          m: 0,
                        }}
                      >
                        {item.recommendation}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "#1976d2" }}>
                  <ChatIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  <CircularProgress size={16} color="inherit" />
                </Typography>
              </Box>
            )}
          </Box>
          <Box display="flex" gap={1} mt={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Posez votre question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ bgcolor: "#23272f", input: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={loading || !question.trim()}
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                ml: 1,
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Chatbot;
