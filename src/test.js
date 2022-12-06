const test = require("./utils")

try {
    console.log(test.checkUrl("https://mail.google.com/mail/u/0/#drafts"))
} catch (e) {
    console.log(e)
}

var path1 = "D:/test.xml";               // D:/test.xml
var path2 = "D:\\folder\\test.xml";      // D:\folder\test.xml
var path3 = "D:/folder/test.xml";        // D:/folder/test.xml
var path4 = "D:\\folder/test.xml";       // D:\folder/test.xml
var path5 = "D:\\test.xml&";              // D:\test.xml


try {
    console.log( test.checkPath(path1) );
    console.log( test.checkPath(path2));
    console.log(test.checkPath(path3));
    console.log(test.checkPath(path4));
    console.log(test.checkPath(path5));
} catch (e) {
    console.log(e)
}
