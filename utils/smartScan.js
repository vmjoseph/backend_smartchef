const path = require("path");
const fs = require('fs')

const fractionRegex = /[\u2150-\u215E\u00BC-\u00BE]/u;
const file = fs.readFileSync(path.resolve(__dirname, "./measurements.json"));
const test_obj = {
    "title": "Flavorful Beef Stir-Fry",
    "ing_list": [
    "2 cups brown rice",
    "4 cups water",
    "2 tablespoons cornstarch",
    "2 teaspoons white sugar",
    "6 tablespoons soy sauce",
    "¼ cup white wine",
    "1 tablespoon minced fresh ginger",
    "1 pound boneless beef round steak, cut into thin strips",
    "1 tablespoon vegetable oil",
    "3 cups broccoli florets",
    "2 carrots, thinly sliced",
    "1 (6 ounce) package frozen pea pods, thawed",
    "2 tablespoons chopped onion",
    "1 (8 ounce) can sliced water chestnuts, undrained",
    "1 cup Chinese cabbage",
    "2 large heads bok choy, chopped",
    "1 tablespoon vegetable oil"
    ],
    "instructions": "ayyy lmao"
};

let ingredients = [];

//    (a)=> a+100;
// console.log(a);
let rawdata = file;
let measurements = JSON.parse(rawdata);
//ingredient regex
let regex;

let finallist = "";
// convert vulgar fraction to decimal
let vulgarFraction = (s) =>([n,d]=s.split(/\D/),d)?(n||1)/d:'131111121234151357'[i=s.charCodeAt()%63%20]/-~'133689224444557777'[i]
function createRegex(type, unit){
    const size = measurements[type][unit].length
    measurements[type][unit].forEach((v, i)=>{
        // console.log(v,i,volSize);
        if( i == 0 ){
            finallist+="("+v+"|";
        }else if( i !== (size -1)){
            finallist+= v + "|"
        }else{
            finallist+=v + ")";
        }
    })
    const empty =""
    const rg =  new RegExp("(([1-9]\\d*(\\.\\d+)?)|[\\u2150-\\u215E\\u00BC-\\u00BE])\\s*"+finallist+"\\s*(.*)","gmu");

    return {result:finallist, regex:rg};
}


function scanIngredients(ingredient, type){
    if(type === 'imperial'){
        // console.log(ingredient)
        console.log(ingredient, measurements[type]);
    }else if (type === 'metric'){
        // console.log(ingredient)
        console.log(ingredient, measurements[type]);
    }
}
function replaceVulgar(ing){
       if( ing.match(fractionRegex)){
           return parseFloat(vulgarFraction(ing.match(fractionRegex)[0]))
       }else{
           return parseInt(ing);
       }


}

function newCreateReg(type){
    tempCombo = "("
    mes_types = (Object.keys(measurements[type]));
    mes_types.forEach(mes=>{
        measurements[type][mes].forEach(t=>{
            tempCombo+=t+"|"
        })
    })
    lastIndex = tempCombo.lastIndexOf("|");
   
    
    tempCombo = tempCombo.substring(0, lastIndex) + ")"  
    return tempCombo
}
newCreateReg("imperial");
var replace = "([1-9]\\d*(\\.\\d+)?|[\\u2150-\\u215E\\u00BC-\\u00BE])\\s*"+newCreateReg("imperial")+"\\s*(.*)";
var re = new RegExp(replace,"gmu");

test_obj.ing_list.forEach(list=>{
    if(list.match(re)){
        let m;
        let parsedList;
        m = re.exec(list)
        parsedList = {name:m[4],medium:m[3],qty:replaceVulgar(m[1])};
        ingredients.push(parsedList);
    }else{
        console.log("non match");
        console.log(list)
    }
})
console.log(ingredients)

console.log(re)

// /\s*\"(\d*\s*(cups|tablespoons|teaspoons|cup|pound|tablespoon))/gm;

//\s*\"(\d*\s*(cups|tablespoons|teaspoons|cup|pound|tablespoon))