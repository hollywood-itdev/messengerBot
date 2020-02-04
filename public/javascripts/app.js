let data = {
  step: 0
}

function botSay(message) {
  $('#messages').append(`
        <div class="d-flex justify-content-start mb-4">
          <div class="img_cont_msg">
            <img src="/images/messenger-facebook-messenger-icon-clipart.png" alt="Messenger" class="rounded-circle user_img_msg"/>
          </div>
          <div class="msg_cotainer">
            ${message}
          </div>
        </div>`);
}

function userSay(message) {
  $('#messages').append(`
        <div class="d-flex justify-content-end mb-4">
          <div class="msg_cotainer_send">
            ${message}
          </div>
          <div class="img_cont_msg">
            <img src="/images/software-crystal-msn-icon.png" alt="You" class="rounded-circle user_img_msg">
          </div>
        </div>`);
  $("#messages").scrollTop($("#messages").get(0).scrollHeight);

}

function sendMessage(newData) {
  console.log(newData);
  fetch('/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  }).then((response) => {
    return response.json();
  })
    .then(res => {
      if (res.step < 5) {
        data = {
          step: res.step,
          id: res.id,
          message: res.message
        };
      }
      if (res.message != undefined && res.message != '') {
        botSay(res.message);
        $("#messages").scrollTop($("#messages").get(0).scrollHeight);
      }
    });
}

$(document).ready(function () {

  sendMessage(data);
  $("#message").keypress(function (e) {
    if (e.keyCode == 13) {
      if (this.value != '') {
        data.message = this.value;
        userSay(data.message);
        sendMessage(data);
        this.value = '';
      }
    }
  });
  $("#sendButton").click(function () {
    let message = $("#message").val();
    console.log(message);
    if (message != '' && message != undefined) {
      data.message = message;
      userSay(data.message);
      sendMessage(data);
      document.getElementById("message").value="";
    }
  })
})