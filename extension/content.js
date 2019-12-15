console.log('Passmanager: content script loaded')

// find all inputs that could be username/password

if (window.getInputs === undefined) {
    window.getInputs = () => {
        let inputs = document.getElementsByTagName('input')
        let inputsToTreat = []
        for (var i = 0; i < inputs.length; i++) {
            inputsToTreat.push(inputs[i])
        }
        let loginInputs = inputsToTreat.filter(input => 
            input.type === 'text' ||
            input.type === 'email' ||
            input.id.indexOf('login') !== -1
        )
        let passwordInputs = inputsToTreat.filter(input => input.type === 'password')

        if (loginInputs.length >= 1 && passwordInputs.length >= 1) {
            console.log('Found a proper login form to fill')
            // loginInputs[0].value = 'helloworld'
            // passwordInputs[0].value = 'helloworld'
            return [loginInputs[0], passwordInputs[0]]
        }
    }
}

console.log(window.getInputs())