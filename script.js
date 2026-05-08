const API_KEY = promt("Enter OpenRouter API Key";

const chatBox = document.getElementById("chat-box");

function addMessage(message, className){

  const div = document.createElement("div");

  div.className = className;

  div.innerHTML = message;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(){

  const input = document.getElementById("user-input");

  const message = input.value.trim();

  if(!message) return;

  addMessage(message, "user-message");

  input.value = "";

  const typing = document.createElement("div");

  typing.className = "typing";

  typing.innerHTML = "AlphaGPT is typing...";

  chatBox.appendChild(typing);

  try{

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "AlphaGPT",
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "mistralai/mistral-7b-instruct",

          messages: [
            {
              role: "user",
              content: message
            }
          ]

        })

      }
    );

    const data = await response.json();

    typing.remove();

    console.log(data);

    if(data.choices){

      addMessage(
        data.choices[0].message.content,
        "bot-message"
      );

    }else{

      addMessage(
        "API Error: " + JSON.stringify(data),
        "bot-message"
      );

    }

  }catch(error){

    typing.remove();

    addMessage(
      "Connection failed.",
      "bot-message"
    );

    console.log(error);

  }

}

function clearChat(){

  chatBox.innerHTML = "";

}
