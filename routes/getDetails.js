var express = require('express');
var router = express.Router();
const jsdom = require('jsdom');
const got = require('got');
const { JSDOM } = jsdom

/* GET home page. */
router.get('/', function(req, res, next) {
    
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({hi:'sup'}))
});
router.post('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({hi:req.body}))
  });

  
async function getIncredients(url){
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const nodeList = [...dom.window.document.querySelectorAll('article.fixed-recipe-card')];
    return nodeList
}


module.exports = router;
