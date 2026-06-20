import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  PERPLEXITY_API_KEY,
  PERPLEXITY_API_URL,
  PERPLEXITY_MODEL,
  AI_SYSTEM_PROMPT,
  isAiConfigured,
} from "../config/aiConfig";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your Ask AI assistant. Ask me about drug side effects, causality, " +
    "or how to fill the ADR form.",
};

// ---- Context so any screen can open the chat (optionally pre-filled) ----
type AskAIContextType = {
  /** Open the chat. Pass text to pre-fill the input box. */
  ask: (prefill?: string) => void;
};

const AskAIContext = createContext<AskAIContextType>({ ask: () => {} });

export const useAskAI = () => useContext(AskAIContext);

export function AskAIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);

  const ask = (prefill?: string) => {
    if (prefill) setInput(prefill);
    setOpen(true);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const history = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(history);
    setInput("");
    scrollToEnd();

    // No key yet — keep the UI usable with a clear hint.
    if (!isAiConfigured()) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "⚠️ No API key configured yet. Add your Perplexity key in " +
            "src/config/aiConfig.ts (PERPLEXITY_API_KEY) and replies will work.",
        },
      ]);
      scrollToEnd();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(PERPLEXITY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: PERPLEXITY_MODEL,
          messages: [
            { role: "system", content: AI_SYSTEM_PROMPT },
            // Send the conversation without the local greeting bubble.
            ...history.filter((m) => m !== GREETING),
          ],
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`API error ${res.status}. ${detail.slice(0, 200)}`);
      }

      const data = await res.json();
      const reply: string =
        data?.choices?.[0]?.message?.content?.trim() || "No response received.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ ${e?.message || "Something went wrong. Check your connection and API key."}`,
        },
      ]);
    } finally {
      setLoading(false);
      scrollToEnd();
    }
  };

  return (
    <AskAIContext.Provider value={{ ask }}>
      {children}

      {/* Floating action button — visible on every screen */}
      <Pressable
        style={styles.fab}
        onPress={() => setOpen(true)}
        accessibilityLabel="Ask AI"
      >
        <Text style={styles.fabIcon}>💬</Text>
        <Text style={styles.fabLabel}>Ask AI</Text>
      </Pressable>

      {/* Chat window */}
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheet}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Ask AI</Text>
                <Text style={styles.headerSubtitle}>
                  {isAiConfigured()
                    ? "Powered by Perplexity"
                    : "Demo mode — add API key"}
                </Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setOpen(false)}
                accessibilityLabel="Close chat"
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={scrollToEnd}
            >
              {messages.map((m, i) => (
                <View
                  key={i}
                  style={[
                    styles.bubble,
                    m.role === "user" ? styles.bubbleUser : styles.bubbleAi,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      m.role === "user" && styles.bubbleTextUser,
                    ]}
                  >
                    {m.content}
                  </Text>
                </View>
              ))}
              {loading && (
                <View style={[styles.bubble, styles.bubbleAi, styles.typingRow]}>
                  <ActivityIndicator size="small" color="#414071" />
                  <Text style={styles.typingText}>Thinking…</Text>
                </View>
              )}
            </ScrollView>

            {/* Input bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type your question…"
                placeholderTextColor="#9ca0c0"
                multiline
                onSubmitEditing={send}
                returnKeyType="send"
              />
              <Pressable
                style={[
                  styles.sendBtn,
                  (!input.trim() || loading) && styles.sendBtnDisabled,
                ]}
                onPress={send}
                disabled={!input.trim() || loading}
              >
                <Text style={styles.sendBtnText}>Send</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </AskAIContext.Provider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 999,
  },
  fabIcon: { fontSize: 18, marginRight: 8 },
  fabLabel: { color: "#fff", fontWeight: "700", fontSize: 15 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "82%",
    backgroundColor: "#f5f6fb",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#414071",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  headerSubtitle: { color: "#c7c9e6", fontSize: 12, marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  messages: { flex: 1 },
  messagesContent: { padding: 14, paddingBottom: 18 },
  bubble: {
    maxWidth: "85%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#414071",
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7f0",
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: "#23264c", lineHeight: 20 },
  bubbleTextUser: { color: "#fff" },
  typingRow: { flexDirection: "row", alignItems: "center" },
  typingText: { marginLeft: 8, color: "#6b6f8e", fontSize: 13 },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7f0",
  },
  input: {
    flex: 1,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: "#dde0ec",
    backgroundColor: "#fafbff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#23264c",
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#414071",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#9d9eb5" },
  sendBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
