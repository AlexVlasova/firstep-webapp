var firebaseConfig = {
    apiKey: "AIzaSyDMnXgRUGrSmS3hSi78jGuxVrZaI9b6Xg8",
    authDomain: "firstep-ad5d3.firebaseapp.com",
    databaseURL: "https://firstep-ad5d3.firebaseio.com",
    projectId: "firstep-ad5d3",
    storageBucket: "firstep-ad5d3.appspot.com",
    messagingSenderId: "1071836711242",
    appId: "1:1071836711242:web:4623dbdb17e9500e1859b3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// Настраиваем капчу
firebase.auth().useDeviceLanguage();
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('confirm-phone', {
    'size': 'invisible',
    'callback': function(response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
});  

// Необходимые поля
const phoneInput = document.querySelector('input[name="phone"]');
const codeContainer = document.querySelector('.code-input');
const codeInput = codeContainer.querySelectorAll('input[name="code"]');
const phoneBtn = document.querySelector('.confirm-phone');
const confirmElements = document.querySelectorAll('.confirm');
const personElements = document.querySelectorAll('.person-info');

phoneBtn.addEventListener('click', () => {
    let phoneNumber = phoneInput.value;
    console.log(phoneNumber);

    // phoneNumber = '+79998888080';

    const appVerifier = window.recaptchaVerifier;
    
    firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
            console.log('SMS sent');
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
        })
        .catch(function (error) {
            console.log('Sms error');
            // Error; SMS not sent
            window.recaptchaVerifier.render()
                .then(function(widgetId) {
                    grecaptcha.reset(widgetId);
                });              
        });


        phoneInput.classList.add('hide');
        phoneBtn.classList.add('hide');
        confirmElements[0].textContent = phoneNumber;
        confirmElements.forEach((elem) => {
            elem.classList.remove('hide');
        });
        codeContainer.classList.remove('hide');
});

let token = '';

codeInput[5].addEventListener('keydown', (event) => {
    if (event.code === "Enter") {
        // Return a user object if the authentication was successful, and auth is complete
        let code = "";
        codeInput.forEach((elem) => {
            code += elem.value;
        });
        personElements[0].textContent = code;

        confirmationResult
            .confirm(code)
            .then(function(result) {
                const user = result.user;
                console.log(user);

                token = user.refreshToken;
                console.log(token);
            })
            .catch(function(error) {
                console.log(error);
            });
        codeContainer.classList.add('hide');
        personElements.forEach((elem) => {
            elem.classList.remove('hide');
        });
    }
});

const fbBtn = document.querySelector('.fb-btn');

let provider = new firebase.auth.FacebookAuthProvider();
// Можно настроить сразу брать данные о пользователе у Facebook

fbBtn.addEventListener('click', (event) => {
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            
            console.log(token)
            console.log(user)
        }).catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });
});

        
        
