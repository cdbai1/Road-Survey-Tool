

var assert = require('assert'); // default node assertion library
var d = new Date();
var dateString = d.getHours()+':'+d.getMinutes()+' '+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();

/**
 * Begin Unit Testing
 */
describe('Road Survey Tool Unit Tests\n  '+ dateString +'\n  *********************', function(){
    describe('--------------------\n    File: map.js\n    --------------------', function() {
        // test creating the square with centre of user input
        describe('Method: getSquarePath(centreLngLat, metres)', function() {
            describe('lower bounds',function(){
                it('should return false when centreLngLat contains a longitude < -180', function(){
                    assert.equal(false, getSquarePath({lng:-181,lat:0},1));
                });
                it('should return false when centreLngLat contains a latitude < -180', function(){
                    assert.equal(false, getSquarePath({lng:0,lat:-181},1));
                });
                it('should return false when centreLngLat contains a long and lat < -180', function(){
                    assert.equal(false, getSquarePath({lng:-181,lat:-181},1));
                });
                it('should return false when metres == 0', function(){
                    assert.equal(false, getSquarePath({lng:0,lat:-0},0));
                });
                it('should return false when metres <= 0', function(){
                    assert.equal(false, getSquarePath({lng:0,lat:0},-1));
                });
            });
            describe('upper bounds',function(){
                it('should return false when centreLngLat contains a longitude > 180', function(){
                    assert.equal(false, getSquarePath({lng:-181,lat:0},1));
                });
                it('should return false when centreLngLat contains a latitude > 180', function(){
                    assert.equal(false, getSquarePath({lng:0,lat:181},1));
                });
                it('should return false when centreLngLat contains a long and lat > 180', function(){
                    assert.equal(false, getSquarePath({lng:181,lat:181},1));
                });
            });
            describe('inside bounds',function(){
                it('should return values when centreLngLat contains a longitude > 180', function(){
                    assert.notEqual(null, getSquarePath({lng:10,lat:0},1));
                });
                it('should return values when centreLngLat contains a latitude > 180', function(){
                    assert.notEqual(null, getSquarePath({lng:0,lat:60},1));
                });
                it('should return values when centreLngLat contains a long and lat > 180', function(){
                    assert.notEqual(null, getSquarePath({lng:-40,lat:30},1));
                });
            });
        });
        // test generating a google static maps url
        describe('Method: generateMapURL(polygonPoints)', function() {
            describe('inside bounds', function(){
                it('should return URL from values 0,0|0,0|0,0|0,0', function(){
                    URL = "https://maps.googleapis.com/maps/api/staticmap?size=500x500&stle=transit|element:geometry|visibility:off&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x000000&style=feature:road|element:geometry|visibility:simplified|color:0xffffff&path=weight:0|fillcolor:0x4d5bf9|0,0|0,0|0,0|0,0&key=AIzaSyA9e944TTsuLO4ffAAaBA_1KR6NCHXZKW4";
                    assert.equal(URL,generateMapURL([{lng:0,lat:0},{lng:0,lat:0},{lng:0,lat:0},{lng:0,lat:0}]));
                });
                it('should return URL from values 20,10|30,20|40,30|50,40', function(){
                    URL = "https://maps.googleapis.com/maps/api/staticmap?size=500x500&stle=transit|element:geometry|visibility:off&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x000000&style=feature:road|element:geometry|visibility:simplified|color:0xffffff&path=weight:0|fillcolor:0x4d5bf9|20,10|30,20|40,30|50,40&key=AIzaSyA9e944TTsuLO4ffAAaBA_1KR6NCHXZKW4";
                    assert.equal(URL,generateMapURL([{lng:10,lat:20},{lng:20,lat:30},{lng:30,lat:40},{lng:40,lat:50}]));
                });
            });
        });

    });

    describe('--------------------\n    File: processImage.js\n    --------------------', function(){
        // test cropping an image to remove any greyscale pixels
        describe('Method: cropImage(imageData)', function(){
            describe('Greyscale images', function(){
                it('should turn an all white image to all transparent', function(){
                    assert.deepEqual([255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0]
                    ,cropImage([255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255]));
                });
                it('should turn an all greyscale image to all transparent', function(){
                    assert.deepEqual([111,111,111,0,222,222,222,0,001,001,001,0,60,60,60,0]
                    ,cropImage([111,111,111,255,222,222,222,255,001,001,001,255,60,60,60,255]));
                });
                it('should turn an all black image to all transparent', function(){
                    assert.deepEqual([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    ,cropImage([0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255]));
                });
            });
            describe('Full color images', function(){
                it('should not alter a solid red image', function(){
                    assert.deepEqual([255,0,0,255,255,0,0,255,255,0,0,255,255,0,0,255]
                    ,cropImage([255,0,0,255,255,0,0,255,255,0,0,255,255,0,0,255]));
                });
                it('should not alter a solid green image', function(){
                    assert.deepEqual([0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255]
                    ,cropImage([0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255]));
                });
                it('should not alter a solid blue image', function(){
                    assert.deepEqual([0,0,255,255,0,0,255,255,0,0,255,255,0,0,255,255]
                    ,cropImage([0,0,255,255,0,0,255,255,0,0,255,255,0,0,255,255]));
                });
                it('should not alter an image with a variety of random colors', function(){
                    assert.deepEqual([37,180,220,255,251,110,1,255,101,42,12,255,12,18,91,255]
                    ,cropImage([37,180,220,255,251,110,1,255,101,42,12,255,12,18,91,255]));
                });
            });
            describe('Images with grey and color', function(){
                it('should change greyscale pixels to transparent, color pixels remain', function(){
                    assert.deepEqual([255,255,255,0,100,100,100,0,255,0,0,255,255,0,0,255,255,255,255,0,100,100,100,0]
                    ,cropImage([255,255,255,255,100,100,100,255,255,0,0,255,255,0,0,255,255,255,255,255,100,100,100,255]));
                });
            });
        });
        // test getting the number of pixels in the image that are non road pixels
        describe('Method: getNonRoadPx(imageData)', function(){
            describe('Total matches/fails', function(){
                it('should count 0 non road px in an array of 20 px that arent (r,g,b) == (38,45,124)', function(){
                    assert.equal(0, getNonRoadPx([0,0,0,255,1,1,1,255,50,50,50,255,100,100,100,255,150,150,150,255,200,200,200,255,250,250,250,255,250,250,250,255,250,250,250,255,130,130,130,255,140,140,140,255,130,12,255,31,42,15,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255]));
                });
                it('should count 20 non road px in an array of 20 px that are (r,g,b) == (38,45,124)', function(){
                    assert.equal(20, getNonRoadPx([38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255,38,45,124,255]));
                });
                it('should count 1 non road px in an array of 20 px that has 1 px with (r,g,b) == (38,45,124)', function(){
                    assert.equal(1, getNonRoadPx([0,0,0,255,1,1,1,255,50,50,50,255,100,100,100,255,150,150,150,255,38,45,124,255,250,250,250,255,250,250,250,255,250,250,250,255,130,130,130,255,140,140,140,255,130,12,255,31,42,15,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255,0,0,0,255]));
                });
            });
            describe('Partial matches/fails', function(){
                it('only r value is correct',function(){
                    assert.equal(0, getNonRoadPx([38,0,0,255]));
                });
                it('only b value is correct',function(){
                    assert.equal(0, getNonRoadPx([0,45,0,255]));
                });
                it('only g value is correct',function(){
                    assert.equal(0, getNonRoadPx([0,0,124,255]));
                });
                it('only r,b values are correct',function(){
                    assert.equal(0, getNonRoadPx([38,45,0,255]));
                });
                it('only r,g values are correct',function(){
                    assert.equal(0, getNonRoadPx([38,0,124,255]));
                });
                it('only g,b values are correct',function(){
                    assert.equal(0, getNonRoadPx([0,45,124,255]));
                });
            });
        });
    });
});





/** 
 * Stripped versions of functions used for testing
 * Any references to Google API functions are hard coded to allow for testing without dependency
*/
function getSquarePath(centreLngLat, metres) {
    if(centreLngLat.lng<-180 || centreLngLat.lat<-180 || centreLngLat.lng>180 || centreLngLat.lat>180 || metres<=0){
        return(false);}
    var nw = centreLngLat; // replace google functions with input to show there is output
    nw = centreLngLat;
    var ne = centreLngLat;
    var se = centreLngLat;
    var sw = centreLngLat;
    return [nw, ne, se, sw];
}

function generateMapURL(polygonPoints){
    var URL = "https://maps.googleapis.com/maps/api/staticmap?size=500x500&stle=transit|element:geometry|visibility:off&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x000000&style=feature:road|element:geometry|visibility:simplified|color:0xffffff&path=weight:0|fillcolor:0x4d5bf9";
    for (var i=0; i < polygonPoints.length; i ++){ 
        URL = URL + "|" + polygonPoints[i].lat + "," + polygonPoints[i].lng;}
    URL += "&key=AIzaSyA9e944TTsuLO4ffAAaBA_1KR6NCHXZKW4"; 
    return URL;
}

function cropImage(imageData){
    pixelArray = imageData;
    for(var i=0; i<pixelArray.length; i+=4){
        if(pixelArray[i] == pixelArray[i+1] && pixelArray[i] == pixelArray[i+2]){
                pixelArray[i+3] = 0;
        }
    }
    return(pixelArray);
}

function getNonRoadPx(pixelData){
    pixelArray = pixelData;
    pxCount = 0;
    for(var i=0; i<pixelArray.length; i+=4){ // iterate over pixels
        if(pixelArray[i] == 38 && pixelArray[i+1] == 45 && pixelArray[i+2] == 124){ // (r,g,b) == (38,45,124)
            pxCount +=1;           
        }
    }
    return(pxCount);
}