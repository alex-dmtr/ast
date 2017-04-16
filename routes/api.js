var express = require('express');
var router = express.Router();
var winston = require('winston');
var Parser = require('../lib/parser').Parser;
var Transpiler = require('../lib/transpiler').Transpiler;

/*
  Expect:
  body {
    code
  }
*/
router.post('/transpile', (req, res) => {
  
  let pseudocode = req.body.code;
  // winston.info("FUCK YOU");
  
  let tree = Parser.parse(pseudocode);
  Transpiler.transpileToCpp(tree)
    .then((code) => {
      res.status(200).send(code);
    })
    .catch((err) => {
      res.status(403).send(err);
    })
});
module.exports = router;