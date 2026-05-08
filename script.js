const API_KEY = prompt("Enter OpenRouter API Key");

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

  if(message === ""){
    return;
  }

  addMessage(message, "user-message");

  input.value = "";

  addMessage("Typing...", "bot-message");

  try{

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "meta-llama/llama-3-8b-instruct",

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

    document.querySelector(".bot-message:last-child").remove();

    console.log(data);

    if(data.choices){

      addMessage(
        data.choices[0].message.content,
        "bot-message"
      );

    }else{

      addMessage(
        "API Error",
        "bot-message"
      );

    }

  }catch(error){

    document.querySelector(".bot-message:last-child").remove();

    addMessage(
      "Connection failed",
      "bot-message"
    );

    console.log(error);

  }

}
