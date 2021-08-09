let request = require("request");
let cheerio = require("cheerio");
let scorecardObj = require("./newScoreCard")
request("https://www.espncricinfo.com/series/ipl-2020-21-1210595", cb);
function cb(error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else 
    {
        allMatchExtract(html);
    }
}
function allMatchExtract(html)
{
    let searchTool = cheerio.load(html);
    let anchorRep = searchTool('a[data-hover="View All Results"]');
    let link = anchorRep.attr("href");
    // console.log(link);
    let fullLink = `https://www.espncricinfo.com${link}`;
    //console.log(fullLink);
    request(fullLink, allMatchScoreCard);
}

function allMatchScoreCard( error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else 
    {
        allMatchGetScore(html);
    }
}

function allMatchGetScore(html)
{
    let searchTool = cheerio.load(html);
    let aElemnetRep = searchTool('.match-info-link-FIXTURES');
    for(let i = 0; i < aElemnetRep.length; i++)
    {
        let link = searchTool(aElemnetRep[i]).attr("href");
        let fullLink = `https://www.espncricinfo.com${link}`;
        console.log(fullLink);
        scorecardObj.psm(fullLink);
    }
}