var express = require('express');
var router = express.Router();
const jsdom = require('jsdom');
const got = require('got');
const { JSDOM } = jsdom

const allrecipesurl = 'https://www.allrecipes.com/search/results/?wt='
const allrecipesurl_temp = 'https://www.allrecipes.com/search/results/?wt=chicken'


router.post('/getRecipe', (req, res)=>{
    getAllRecipes(allrecipesurl + req.body.search_query).then((response)=>{
        let recipeObj = {
            'query': allrecipesurl,
            'search': req.body.search_query,
            'full-search': encodeURI(allrecipesurl + req.body.search_query),
            'results': []
        };
       response.forEach((recipie, index)=>{
            const recipetitle = recipie.querySelector('h3 span').innerHTML;
            const recipelink = recipie.querySelector('h3').children[0].getAttribute("href");
            const recipeobject= {
                'id': index,
                'recipe_title': recipetitle,
                'recipe_link': recipelink
            };
            recipeObj.results.push(recipeobject);
       })

     if(req.body.recipe_id){
        const measurement_array= "head"
        const recipeSelectObj = recipeObj.results[req.body.recipe_id];
        let ingredients = {title: recipeObj.results[req.body.recipe_id].recipe_title, ing_list:[], instructions:''}
        console.log(recipeObj.results[req.body.recipe_id].recipe_link)
        getIngredients(recipeObj.results[req.body.recipe_id].recipe_link).then(response=>{
            response.forEach(list=>{
                console.log(list)
                ingredients.ing_list.push(list.querySelector('.ingredients-item-name').innerHTML.replace(/^\s+|\s+$/g, ''));
                console.log(ingredients);
            })
        }).finally(()=>{
            ingredients.instructions="ayyy lmao"
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(ingredients))
        })
        
     } else{
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(recipeObj))
        console.log('chose a recipe');
    }
    })
});


router.get('/', (req,res,resp)=>{
    getAllRecipes(allrecipesurl_temp ).then((response)=>{
        let recipeObj = {
            'query': allrecipesurl_temp,
            'full-search': encodeURI(allrecipesurl_temp),
            'results': []
        };
       response.forEach((recipie, index)=>{
            const recipetitle = recipie.querySelector('h3 span').innerHTML;
            const recipelink = recipie.querySelector('h3').children[0].getAttribute("href");
            const recipeobject= {
                'id': index,
                'recipe_title': recipetitle,
                'recipe_link': recipelink
            };
            recipeObj.results.push(recipeobject);
       })
       
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(recipeObj))
    })
});

async function getAllRecipes(url){
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const nodeList = [...dom.window.document.querySelectorAll('article.fixed-recipe-card')];
    return nodeList
}

  
async function getIngredients(url){
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const nodeList = [...dom.window.document.querySelectorAll('.ingredients-section__fieldset > ul > li')];
    return nodeList
}

module.exports = router;
