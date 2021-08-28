//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs  = require("fs");
let path = require("path");

function procesMatch(url)
{

    request(url, cb);
}


function cb(error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else 
    {
        allMatchScoreCard(html);
    }
}
function allMatchScoreCard(html)
{
    

    let cwd = process.cwd();
    let iplFolderPath = path.join(cwd, "ipl");
    if(fs.existsSync(iplFolderPath) == false)
    {
       fs.mkdirSync("ipl");
    }
    let searchTool = cheerio.load(html);
    let bothInnigArr = searchTool(".Collapsible");
    let scorecard = "";
    
    for(let i = 0; i < bothInnigArr.length; i++)
    {
        scorecard = searchTool(bothInnigArr[i]).html();
         fs.writeFileSync("inning"+ i + ".html" , scorecard );
    
       
        let teamNameElement = searchTool(bothInnigArr[i]).find("h5");
        let teamName = teamNameElement.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        let teamNameFolderPath = path.join(iplFolderPath, teamName);
        //console.log(teamName);
        if(fs.existsSync(teamNameFolderPath) == false)
        {
            fs.mkdirSync(teamNameFolderPath, i+"");
            console.log("created");
        }
        let batsManBody = searchTool(bothInnigArr[i]).find(".table.batsman tbody tr");
        for(let i = 0; i < batsManBody.length; i++)
        {
            let noOfTd = searchTool(batsManBody[i]).find("td");
            if(noOfTd.length == 8)
            {
                let playerArr = [];
                
                let playerName = searchTool(noOfTd[0]).text();
                let balls = searchTool(noOfTd[2]).text();
                let four = searchTool(noOfTd[3]).text();
                let six = searchTool(noOfTd[4]).text();
                let sr = searchTool(noOfTd[6]).text();
                
               let obj = {
                   playerName,
                   balls,
                   four,
                   six,
                   sr,
               }
                
                //console.log(teamNameFolderPath);
                let fileNamePath = path.join(teamNameFolderPath , playerName +".json");
               // console.log(fileNamePath);
                if(fs.existsSync(fileNamePath) == false)
                {
                   // fs.writeFileSync(fileNamePath+".json");
                    playerArr.push(obj);
                }
                else
                {
                    playerArr = getContent(fileNamePath);
                    playerArr.push(obj);
                }
                writeContent(fileNamePath, playerArr);
                //  console.log(four);
                // console.log(six);
                // console.log(sr);
                // console.log(balls);
                // console.log(playerName);
            }
        }
    }
    function getContent(fileNamePath)
    {
        let content = fs.readFileSync(fileNamePath);
        return JSON.parse(content);
    }
    function writeContent(fileNamePath,playerArr)
    {
        let jsonData = JSON.stringify(playerArr);
        fs.writeFileSync(fileNamePath, jsonData);
    }
}


module.exports ={
   psm : procesMatch
}