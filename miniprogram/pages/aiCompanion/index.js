const app = getApp();

const STORAGE_KEY = "imfine_ai_companion_conversation_id";

const createMessage = (role, content) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  role,
  content
});

Page({
  data: {
    inputText: "",
    sending: false,
    scrollTarget: "bottom",
    conversationId: "",
    messages: [
      createMessage("assistant", "我在。你可以从一句很短的话开始，说说今天最占据心里的事情。")
    ]
  },

  onLoad() {
    const conversationId = wx.getStorageSync(STORAGE_KEY) || "";
    this.setData({ conversationId });
  },

  onInput(event) {
    this.setData({
      inputText: event.detail.value
    });
  },

  sendMessage() {
    const content = String(this.data.inputText || "").trim();
    if (!content || this.data.sending) return;

    const nextMessages = [...this.data.messages, createMessage("user", content)];
    this.setData({
      messages: nextMessages,
      inputText: "",
      sending: true,
      scrollTarget: "bottom"
    });

    wx.request({
      url: `${app.globalData.apiBase}/api/ai/companion`,
      method: "POST",
      data: {
        conversation_id: this.data.conversationId,
        messages: nextMessages
          .filter((item) => item.role === "user" || item.role === "assistant")
          .slice(-12)
          .map((item) => ({
            role: item.role,
            content: item.content
          }))
      },
      success: (res) => {
        const payload = res.data || {};
        if (res.statusCode < 200 || res.statusCode >= 300 || !payload.ok) {
          const message = payload.message || payload.error || "暂时没有连上 AI 陪伴";
          this.appendAssistantMessage(message);
          return;
        }
        const conversationId = payload.conversation_id || this.data.conversationId;
        if (conversationId) {
          wx.setStorageSync(STORAGE_KEY, conversationId);
        }
        this.setData({ conversationId });
        this.appendAssistantMessage(payload.reply || "我在听，你可以继续说。");
      },
      fail: () => {
        this.appendAssistantMessage("网络有点不稳，等一下再和我说。");
      },
      complete: () => {
        this.setData({ sending: false, scrollTarget: "bottom" });
      }
    });
  },

  appendAssistantMessage(content) {
    this.setData({
      messages: [...this.data.messages, createMessage("assistant", content)],
      scrollTarget: "bottom"
    });
  }
});
