const test = require("./utils")

try {
    test.checkEmail("mais@gmail.com")
} catch (e) {
    console.log(e)
}