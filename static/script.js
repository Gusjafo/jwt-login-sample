const yourUrl = "./login";


// function handleSubmit(event) {
//     event.preventDefault();

//     const data = new FormData(event.target);

//     const email = data.get('email');
//     const password = data.get('password');

//     console.log({ email });
//     console.log({ password });
// }

// const form = document.querySelector('form');
// form.addEventListener('submit', handleSubmit);


function sendJSON(){
			
    let result = document.querySelector('.result');
    let password = document.querySelector('#password');
    let email = document.querySelector('#email');
    
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    // let url = "submit.php";

    // open a connection
    xhr.open("POST", yourUrl, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Print received data from server
            result.innerHTML = this.responseText;
            let token = this.responseText.token;
            console.log("token: " + token);
            let toke = this.response.token;
            console.log("toke: " + toke);

            if(token) {
                let xhrget = new XMLHttpRequest();
                xhrget.open("GET", "./welcome", true);
                xhrget.setRequestHeader("Content-Type", "application/json");
                xhrget.send(token);
            }




        }
    };

    // Converting JSON data to string
    var data = JSON.stringify({ "password": password.value, "email": email.value });
    console.log("password: " + password.value + ", email: " + email.value)

    // Sending data with the request
    xhr.send(data);
}
