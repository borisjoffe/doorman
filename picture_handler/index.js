var azure = require('azure-storage');
var atob = require('atob')
var picture_handler = {}
var containerName = 'edison-packages-pictures'
picture_handler.parseAndUploadPicture = function(pictureData, callback){
	var blobSvc = azure.createBlobService();
	blobSvc.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response){
	  if(!error){
	    var fileBase64String = pictureData.base64String
	    var contentType = pictureData.contentType
	    var fileFormat = contentType.split("/")[1]
	    var fileName = guid() + "." + fileFormat
	    uploadFile(blobSvc, fileBase64String, contentType, fileName, function(){
	    	console.log("message");
	    })
	  }
	});
}

picture_handler.guid = guid

function uploadFile(blobService, file, contentType,filename, callback) {
    console.log('uploading file');
    var fileBuffer = new Buffer(file, 'base64');
		var blobMetadata = { contentTypeHeader:contentType }
    blobService.createBlockBlobFromStream(containerName, filename, new ReadableStreamBuffer(fileBuffer), fileBuffer.length, blobMetadata, function(error){
      if(error){
        console.log(error);
        callback(error);
        return;
      }
      console.log('file uploaded')
      callback();
     });
}

var ReadableStreamBuffer = function(fileBuffer) {
    var that = this;
    stream.Stream.call(this);
    this.readable = true;
    this.writable = false;
    var frequency = 50;
    var chunkSize = 1024;
    var size = fileBuffer.length;
    var position = 0;
 
    var buffer = new Buffer(fileBuffer.length);
    fileBuffer.copy(buffer);
 
    var sendData = function() {
	    if(size === 0) {
        that.emit("end");
        return;
	    }
	    var amount = Math.min(chunkSize, size);
	    var chunk = null;
	    chunk = new Buffer(amount);
	    buffer.copy(chunk, 0, position, position + amount);
	        position += amount;
	    size -= amount;
	    that.emit("data", chunk);
    };
 
    this.size = function() {
        return size; 
    };
 
    this.maxSize = function() {
        return buffer.length;
    };
 
    this.pause = function() {
        if(sendData) {
            clearInterval(sendData.interval);
            delete sendData.interval;
        }
    };
 
    this.resume = function() {
        if(sendData && !sendData.interval) {
            sendData.interval = setInterval(sendData, frequency);
        }
    };
 
    this.destroy = function() {
        that.emit("end");
        clearTimeout(sendData.interval);
        sendData = null;
        that.readable = false;
        that.emit("close");
    };
 
    this.setEncoding = function(_encoding) {
    };
 
    this.resume();
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = picture_handler;


//function b64toBlob(b64Data, contentType, sliceSize, callback) {
//  contentType = contentType || '';
//  sliceSize = sliceSize || 512;
//
//  var byteCharacters = atob(b64Data);
//  var byteArrays = [];
//
//  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//      var slice = byteCharacters.slice(offset, offset + sliceSize);
//
//      var byteNumbers = new Array(slice.length);
//      for (var i = 0; i < slice.length; i++) {
//          byteNumbers[i] = slice.charCodeAt(i);
//      }
//
//      var byteArray = new Uint8Array(byteNumbers);
//
//      byteArrays.push(byteArray);
//  }
//
//  var blob = new Blob(byteArrays, {type: contentType});
//  return blob
//}