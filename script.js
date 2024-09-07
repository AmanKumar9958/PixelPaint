// Selecting elements...
const colorPickerButton = document.querySelector('#color-picker');
const pickedColorsList = JSON.parse(localStorage.getItem("picked-colors") || "[]");
const clearALL = document.querySelector(".clear-all");
const colorsList = document.querySelector('.all-colors');

const copyCode = elem => {
    navigator.clipboard.writeText(elem.dataset.color);
    elem.innerText = "Copied";
    setTimeout(() => elem.innerText = elem.dataset.color, 1000)
}

// Showing all colors..
const showColors = () => {
    if(!pickedColorsList.length) return;
    colorsList.innerHTML = pickedColorsList.map(color => `
            <li class="color">
                <span class="rect" style= "background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc": color}"></span>
                <span class="value" data-color="${color}">${color}</span>
            </li>
        `).join("");


    // showing some options..
    document.querySelector('.picked-color').classList.remove('hide-picked-colors');
    // Adding copy option..
    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyCode(e.currentTarget.lastElementChild))
    })
}

// opening the eye dropper and getting the selected color
const activateEyeDropper = () => {
    document.body.style.display = 'none';
    setTimeout(async () =>{
        try{
            const eyeDropper = new EyeDropper();
            const {sRGBHex} = await eyeDropper.open();
            navigator.clipboard.writeText(sRGBHex);
            // Preventing the duplicate colors from adding in the list..
            if(!pickedColorsList.includes(sRGBHex)){
                pickedColorsList.push(sRGBHex);
                localStorage.setItem("picked-colors", JSON.stringify(pickedColorsList))
                showColors();
            }
        }
        catch(error){
            console.error("Failed to copy the color code!");
        }
        document.body.style.display = 'block';
    }, 10)
}

// clearing all colors..
const clearAllColors = () => {
    pickedColorsList.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColorsList));
    document.querySelector('.picked-color').classList.add('hide-picked-colors');
}


// adding event listeners..
colorPickerButton.addEventListener("click", activateEyeDropper);
clearALL.addEventListener("click", clearAllColors);