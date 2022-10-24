import "./css/index.css"
import IMask from 'imask'

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo= document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    "visa": ["#436D99", "#2D57F2"],
    "mastercard": ["#DF6F29", "#C69347"],
    "default": ["black", "gray"]
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

setCardType("default");

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "000",
};
// IMask(element, pattern)
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const dateExp = document.querySelector("#expiration-date");
const dateExpPattern = {
  mask: "MM/YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
};
const expirationDateMasked = IMask(dateExp, dateExpPattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,"");
    const maskFound = dynamicMasked.compiledMasks.find((item) => {  
      return number.match(item.regex);
    });

    return maskFound
  }
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

// prevent default reload on submit
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
});

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  window.alert("Cartão adicionado com sucesso!");
});

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  
  ccHolder.innerText = cardHolder.value.length === 0 ? "SEU NOME AQUI" : cardHolder.value
});

function updateSecurityCode(cvc) {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = cvc.length === 0 ? "123" : cvc
}

function updateCardNumber(number) {
  const  ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "MM/YY" : date
}

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});
