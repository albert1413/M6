let items =  [];
let text = "";

function Numeros(inputId){
    let inputValue = document.getElementById(inputId).value;
    let inputField = document.getElementById(inputId);
    let errorMessage = document.getElementById("error-message-" + inputId);
    if(Error(inputValue, inputField,  errorMessage)){
        items.push(inputValue);
        document.getElementById("contar").innerHTML = items.length;
        updateContador();
        MostraDades();
    }
}

function Error(inputValue, inputField,  errorMessage){
    if (inputValue.trim() === "") {
        errorMessage.innerHTML = "No deixis l'espai en blanc.";
        inputField.style.border = "1px solid red";
        return false
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue)) {
        errorMessage.innerHTML = "Els caracters especials i els números no estan disponibles.";
        inputField.style.border = "1px solid red";
        return false
    } else {
        inputField.style.border = "1px solid green";
        errorMessage.innerHTML = "";
        return true
    }
}
        
function MostraDades(){
    var text = "<ul>"
    for (var i = 0; i < items.length; i++) {
        text += "<li>"+ items[i] + "<button onclick = 'deleteDades(" + i + ")'> Delete</button></li>";
    }
    text += "</ul>";
    document.getElementById("items").innerHTML = text;
}
function deleteDades(index){
    items.splice(index, 1)
    MostraDades();
    updateContador();
}
function updateContador(){
    document.getElementById("contar").innerHTML = items.length;
}

window.onload = MostraDades;       