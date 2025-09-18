async function sendMessage() {
  const input = document.getElementById("user-input").value;
  if (!input) return;

  const chatBox = document.getElementById("chat-box");

  // Add user message bubble
  const userBubble = document.createElement("div");
  userBubble.className = "user-message";
  userBubble.textContent = input;
  chatBox.appendChild(userBubble);

  // Clear input field
  document.getElementById("user-input").value = "";

  try {
    const response = await fetch("https://your-render-url.onrender.com/chat", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();

    // Add bot message bubble with typing animation
    const botBubble = document.createElement("div");
    botBubble.className = "bot-message";
    chatBox.appendChild(botBubble);
    typeReply(data.reply, botBubble);

  } catch (error) {
    console.error("Error:", error);
    const errorBubble = document.createElement("div");
    errorBubble.className = "bot-message";
    errorBubble.style.color = "red";
    errorBubble.textContent = "Error fetching response";
    chatBox.appendChild(errorBubble);
  }

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing animation function
function typeReply(text, container) {
  let i = 0;
  const interval = setInterval(() => {
    container.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 30); // Adjust typing speed here
}
