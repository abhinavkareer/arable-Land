

var fs=require('fs');

var landArea=[];
var hpp=[];
var hectare=[];
var africanLandArea=[];
var countryContinentdata=[];
 var countryContinentMap=JSON.parse(fs.readFileSync('finalData/countryContinentMap.json', 'utf8'));
// console.log(countryContinentMap);
//var countryContinentMap={};
var southStates=["Andhra Pradesh","Karnataka","Kerala","Tamil Nadu"];

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
var populateSingleObj=function(name,prod)
{
  this.name=name;
  this.prod=prod;

}
var populateSingleObjAreaWise=function(year,state,prod)
{

  this.year=year.substring(year.indexOf("-")+1);
  this.state=state;
  this.prod=prod;

}

var splitCsvRowToCols=function(row)
{

return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
}
var sortArray=function(arr,prop)
{
  arr.sort(function (a, b) {
    aVal=parseFloat(a[prop]);
    bVal=parseFloat(b[prop]);
  if (parseFloat(aVal) < bVal) {
    return 1;
  }
  if (aVal > bVal) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
return arr;
}

// checks for NA values and truns them to 0
var checkForNA=function(x)
{
  if(x=="NA" || x==NaN || x=="")
  {
    return 0;
  }
  return x;
}
// checkForKeywords(true/false,comma SeparatedKeywords)
var checkForKeywords=function(req,str,line)
{
  str=str.toLowerCase();
  line=line.toLowerCase();
  strs=str.split(",");
  for(i=0;i<strs.length;i++)
  {
    flag=false;
    if(line.indexOf(strs[i])>=0)
    {
      flag=true;
    }

    if( ( req && flag ) || ( !req && !flag ) ) {

    }
    else {
      return false;
    }
  }

  return true;
}
var fetchCropName=function(fullName){
  fullnames=fullName.split(" ");
  if(fullnames.length==4)
  {
    return fullnames[3];
  }
  else if (fullnames.length>4){
    return fullnames[3]+" "+fullnames[4]
  }
  else {
    return "Total";
  }
}
var createCommonTemplate=function(country,initColIndex,line,targetArray)
{


      cols=splitCsvRowToCols(line);
    if(checkForKeywords(true,country,line) )
    {
       for (i=initColIndex-1;i<cols.length;i++)
       {
           targetArray.push(new populateSingleObj(headers[i],checkForNA(cols[i])));
       }
    }

}

////////////////////////////////////////// filtrations based on requirements////////////////////////////////////
// snippet used for First graph
var createJsonForFirstAssignment=function()
{
  var srcFileName="rawData/WDI_Data.csv";
  var targetFile1="finalData/file1.json";
  var lineReader = require('readline').createInterface({
    input: fs.createReadStream(srcFileName)
  });
  console.log("initiating first Assignment transformation!!");
  var rawArr=[];


  headers=[];
  var flag=true;
  lineReader.on('line', function (line,err) {
    if(flag)
    {
      headers=splitCsvRowToCols(line);
      flag=false;
    }
    var indexOf2010=headers.indexOf("2010");

    if (checkForKeywords(true,"Arable land (% of land area)",line) || checkForKeywords(true,"Arable land (hectares per person)",line) || checkForKeywords(true,"Arable land (hectares)",line))
    {

          cols=splitCsvRowToCols(line);
         if(checkForKeywords(true,"Arable land (% of land area)",line) )
         {
            createCommonTemplate("India",5,line,landArea);
          //  console.log(countryContinentMap[cols[0]]);
            if(countryContinentMap[cols[0]]!=undefined && countryContinentMap[cols[0]].indexOf("Africa")>=0)
            {

              for (var i = 4; i < cols.length; i++)
              {
                   africanLandArea.push(new populateSingleObj(cols[0],checkForNA(cols[indexOf2010])));
              }
            }
         }

         if(checkForKeywords(true,"Arable land (hectares per person)",line) )
         createCommonTemplate("India",5,line,hpp);
         if(checkForKeywords(true,"Arable land (hectares)",line) )
         {
            createCommonTemplate("India",5,line,hectare);
            continent=countryContinentMap[cols[0]];
            if(continent!=undefined)
            {


              for (var i = 4; i < cols.length; i++)
              {
                  // countryContinentdata[headers[i]]=countryContinentdata[headers[i]]||{};
                  // countryContinentdata[headers[i]][continent]=countryContinentdata[headers[i]][continent]||0;
                  // countryContinentdata[headers[i]][continent]=countryContinentdata[headers[i]][continent]+parseFloat(checkForNA(cols[i]));


          year=headers[i-1];
          arr=countryContinentdata[i];
          arr=arr||{year:year.substring(year.indexOf("-")+1)};
          arr[continent]=  (arr[continent]||0)+parseFloat(checkForNA(cols[i]));
          countryContinentdata[i-5]=arr;





              }


            }
          }



}

  if (err) {
    throw err;
  }
  else {

  }
});

lineReader.on('close', function () {
  finalObj={};
  finalObj.landArea={arr:landArea,xAxis:"name",yAxis:"prod"};
  finalObj.hpp={arr:hpp,xAxis:"name",yAxis:"prod"};
  finalObj.hectare={arr:hectare,xAxis:"name",yAxis:"prod"};
  finalObj.africanLandArea={arr:africanLandArea,xAxis:"name",yAxis:"prod"};

  // myKey=Object.keys(countryContinentdata);
  // tempObj=[];
  // for(i=0;i<myKey.length;i++)
  // {
  //   tempObj.push({name:myKey[i],countryContinentdata[myKey[i]]});
  // }
finalObj.countryContinentdata=countryContinentdata;

  fs.writeFile(targetFile1,JSON.stringify(finalObj));

});
}
var createJsonForCountryContinentMap=function()
{

  var srcFileName="rawData/continent-lookup-latest.csv";
  var targetFile1="finalData/countryContinentMap.json";
  var lineReader = require('readline').createInterface({
    input: fs.createReadStream(srcFileName)
  });
  console.log("initiating country to continent maping!!");


  lineReader.on('line', function (line,err) {



          cols=splitCsvRowToCols(line);

          countryContinentMap[cols[0]]=cols[1];

  if (err) {
    throw err;
  }
  else {

  }
});

lineReader.on('close', function () {
  fs.writeFile(targetFile1,JSON.stringify(countryContinentMap));

});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//implementations
createJsonForFirstAssignment();
// createJsonForCountryContinentMap();
console.log("done!");
