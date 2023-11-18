const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const gererateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordlength = 10;
let checkCount = 0;
handleslider()


// set password length
function handleslider() {
    inputslider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
}
function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandInteger(0, 9)
}

function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123))
}

function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 91))
}

function generateSymbol() {
    const randNum = getRandInteger(0, symbols.length)
    return symbols.charAt(randNum); // char
}

function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed"
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = ""
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    //special condition
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleslider()
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// slider
inputslider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleslider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

gererateBtn.addEventListener('click', () => {

    // none of the checkbox selected
    if (checkCount <= 0) {
        return
    }
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleslider()
    }
    // lets start the journey to find new password
    //remove old password
    password = "";
    // lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked)
    // {
    //     password += generateUpperCase()
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password += generateLowerCase()
    // }
    // if(symbolsCheck.checked)
    // {
    //     password += generateSymbol()
    // }
    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber()
    // }

    let funarr = [];
    if (uppercaseCheck.checked) {
        funarr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funarr.push(generateUpperCase);
    }
    if (numbersCheck.checked) {
        funarr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funarr.push(generateSymbol);
    }

    //compulsory addition
    for (let i = 0; i < funarr.length; i++) {
        password += funarr[i]();
    }
    //remaining addition
    for (let i = 0; i < passwordlength - funarr.length; i++) {
        let randIndex = getRandInteger(0, funarr.length)
        console.log(randIndex)
        password += funarr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    calStrength();
})