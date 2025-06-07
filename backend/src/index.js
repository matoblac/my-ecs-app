"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
app.get("/", function (req, res) { return res.send("Hello World from Backend!"); });
app.listen(3000, function () { return console.log("Backend running on port 3000"); });
