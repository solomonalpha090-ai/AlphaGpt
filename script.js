const API_KEY = prompt("84770573845c906f7fbc756db8243c3896e7fc92d09c9f7aad4b");

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

  const message = input.value;

  if(message.trim() === ""){
    return;
  }

  addMessage(message, "user-message");

  input.value = "";

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

      console.log(data);

    }

  }catch(error){

    addMessage(
      "Connection failed",
      "bot-message"
    );

    console.log(error);

  }÷

}

function clearChat(){

  chatBox.innerHTML = "";

}
