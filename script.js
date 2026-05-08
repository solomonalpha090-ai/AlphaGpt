const API_KEY = "07119793756184770573845c906f7fbc756db8243c3896e7fc92d09c9f7aad4b";

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

  if(message === "") return;

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
        method:"POST",
        headers:{
          "Authorization":`Bearer ${API_KEY}`,
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          model:"openai/gpt-oss-20b",

          messages:[
            {
              role:"user",
              content:message
            }
          ]

        })

      }
    );

    const data = await response.json();

    typing.remove();

    addMessage(
      data.choices[0].message.content,
      "bot-message"
    );

  }catch(error){

    typing.remove();

    addMessage(
      "Error connecting to AI.",
      "bot-message"
    );

  }

}

function clearChat(){

  chatBox.innerHTML = "";

}
