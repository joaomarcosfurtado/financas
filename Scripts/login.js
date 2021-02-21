const btnSignin = document.querySelector("#signin");
const btnSignup = document.querySelector("#signup");
const body = document.querySelector("body");

btnSignin.addEventListener("click", () => {
  body.className = "sign-in-js";
});

btnSignup.addEventListener("click", () => {
  body.className = "sign-up-js";
});

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:user")) 
    || []
  },

  set(users) {
    localStorage.setItem("dev.finances:user",
     JSON.stringify(users))
  }
}  

const User = {
  all: Storage.get(),

  add(user){
    User.all.push(user)
    AddUsers.init();
  }, 
  
  verifyCreatedLogins(email, cpf) {
     let message = ''
    
    const emailResult = User.all.filter(user => user.email === email)

    if(emailResult.length > 0){
      message = "Email"
    }

    const cpfResult = User.all.filter(user => user.cpf === cpf)
    
    if(cpfResult.length > 0){
      message = "CPF"
    }
    
    return message
  },

  verifyRegisteredUsers(login, password) {
    let message = ''

    const verifyRegisterByEmail = User.all.filter(
    user => user.email === login && user.password === password )
      if(verifyRegisterByEmail.length > 0){
          message = 'email'
      }
    
    const verifyRegisterByCPF = User.all.filter(
    user => user.cpf === login && user.password === password )

      if(verifyRegisterByCPF.length > 0){
          message = 'cpf'
      }
    
    return message
  },

}

function validateCPF(cpf) {
  let Soma;
  let Resto;
  let message;

  Soma = 0;
  message = "";
 
  if (cpf.length != 11) return message = "WrongSizeLength";

  if (/^(.)\1+$/.test(cpf)) return message = false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10)) ) return message = false;

  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11) ) ) return message = false;
    return message = true;
}

const Form = {
  username: document.querySelector('input#username'),
  cpf: document.querySelector('input#cpf'),
  email: document.querySelector('input#email'),
  password: document.querySelector('input#password'),

  getValues() {
    return {
      username: Form.username.value,
      cpf: Form.cpf.value,
      email: Form.email.value,
      password: Form.password.value
    }
  },

  validateFields() {
    const { username, cpf, email, password } = Form.getValues()
    
        // --------- BLANK FIELDS VALIDATION ---------
    
    if (username.trim() === "" || 
        cpf.trim() === "" ||
        email.trim() === "" || 
        password.trim() === "" ) {
          throw new Error("Por favor, Preecha todos os campos")
        } 
        
        // --------- CPF VALIDATION ---------

    if (validateCPF(cpf) === "WrongSizeLength") {
      throw new Error("O CPF deve conter 11 Digitos!")
    }
    
    else if (validateCPF(cpf) === false) {
      throw new Error("Você digitou um CPF inexistente")
    }

      // --------- REPEATED E-MAIL & CPF VALIDATION ---------

    const mensagem = User.verifyCreatedLogins(email, cpf)

    if (mensagem != '') {
      throw new Error( mensagem + " já cadastrado")
    }

  },

  formatValues() {
    let { username, cpf, email, password } = Form.getValues()

    // date = Utils.formatDate(date)

    return {
      username,
      cpf,
      email,
      password,
    }
  },

  saveUser(user) {
    User.add(user)
  },

  clearFields () {
       Form.username.value = ""
       Form.cpf.value = ""
       Form.email.value = "" 
       Form.password.value = "" 
  },

  submitCreateUser(event) {
    event.preventDefault()

    try {
      Form.validateFields()
      const User = Form.formatValues()
      Form.saveUser(User)
      Form.clearFields ()

    } catch (error) {
      alert(error.message)
    }
  }
}

const acessForm = {
  acessEmailCPF: document.querySelector('input#acessEmailCPF'),
  acessPassword: document.querySelector('input#acessPassword'),

  getValues() {
    return {
      acessEmailCPF: acessForm.acessEmailCPF.value,
      acessPassword: acessForm.acessPassword.value
    }
  },

  validateFields() {
    const { acessEmailCPF, acessPassword } = acessForm.getValues()
    
        // --------- BLANK FIELDS VALIDATION ---------
    
    if (acessEmailCPF.trim() === "" || 
        acessPassword.trim() === "" ) {
          throw new Error("Por favor, Preecha todos os campos")
        } 

    const message = User.verifyRegisteredUsers(acessEmailCPF, acessPassword)
    
    if (message === '') {
      throw new Error("Foram informados dados de login incorretos, não foi possível realizar operação!")
    }    
  },
  
  clearFields () {
    acessForm.acessEmailCPF.value = ""
    acessForm.acessPassword.value = ""
  },

  submitValidateUser(event) {
    event.preventDefault()

    try {
      acessForm.validateFields()
      acessForm.clearFields ()
      window.location.href = "./menu.html"
    } catch (error) {
      alert(error.message)
    }
  }
}

const AddUsers = {
  init() {
    Storage.set(User.all)
  },
}
