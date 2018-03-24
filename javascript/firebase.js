 // Initialize Firebase
 var config = {
   apiKey: "AIzaSyBrRQf8bBlL55nJKZANwDrPWbjm79mJ2fo",
   authDomain: "user-admission.firebaseapp.com",
   databaseURL: "https://user-admission.firebaseio.com",
   projectId: "user-admission",
   storageBucket: "user-admission.appspot.com",
   messagingSenderId: "683148603164"
 };
firebase.initializeApp(config);

var uiConfig = {
  signInSuccessUrl: '',
  signInOptions: [
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<#>',
  recaptchaParameters: {
    'size': 'invisible',
  }
}

var ui = new firebaseui.auth.AuthUI(firebase.auth());
//Start method will wait till the DOM is loaded
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // Sign in
    var displayName = user.displayName;

    user.getToken().then(function (accessToken) {
      document.getElementById('sign-in-status').textContent = ' Signed in ';
      document.getElementById('sign-in').textContent = 'Sign out';
      document.getElementById('account-details').textContent = JSON.stringify({
        displayName: displayName
      }, null, ' ');
    });
  } else {
    // Sign out
  }
})


window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('firebaseui-auth-container', {
  'size': 'invisible',
  'callback': function (response) {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  }
});