module.exports = ViewHandler;
var app = require('../../app');
var hbs = require('hbs');
var shortid = require('shortid');
var fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();
var moment = require('moment');
var path = require("path");
var commaNumber = require('comma-number')

var staticVersion = shortid.generate();
function ViewHandler(){}

ViewHandler.initializeGlobalVars = function(){
    hbs.localsAsTemplateData(app);
    app.locals.staticVersion = staticVersion;
    app.locals.isProduction = ( app.get('env') === 'production' );
    return true;
};

ViewHandler.initializeHelpers = function(){
    console.log("came in helpers");
    hbs.registerHelper('ifCond', function (argv1, argv2, options) {
        if (argv1 === argv2){
            return options.fn(this);
        }
        return options.inverse(this);
    });

    hbs.registerHelper('unlessCond', function (argv1, argv2, options) {
        if (argv1 !== argv2)
            return options.fn(this);
        return options.inverse(this);
    });
    hbs.registerHelper('uppercase', function(args){
        return args.toUpperCase();
    });

    hbs.registerHelper('ifAndUndefined', function (argv1, argv2, options){
        if (argv1 && (argv2 === undefined))
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper("evaluateJavascriptValue", function (val) {
        if (val === undefined)
            return "null";
        return val;
    });

    hbs.registerHelper("forTopicCards", function(index_count,block) {
        if(parseInt(index_count)=== 0){
            return block.fn(this);}
    });

    hbs.registerHelper("forBlogCards", function(index_count,block) {
        if(parseInt(index_count)=== 6){
            return block.fn(this);}
    });

    hbs.registerHelper("greaterThan",function(index1, index2, options){
        if(index1>index2){
            return options.fn(this);
        }
    });

    hbs.registerHelper("notEqualTo",function(index1, index2, options){
        if(index1!==index2){
            return options.fn(this);
        }
    });

    hbs.registerHelper("lesserThan",function(index1, index2, options){
        if(index1<index2){
            return options.fn(this);
        }
    });

    hbs.registerHelper("breaklines", function(text) {
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        return text;
    });

    hbs.registerHelper("fetchFirstWord", function(text){
      if(text && text != undefined)
        return text.split(' ', 2)[0];
        else return "";
    });

    hbs.registerHelper("fetchString", function( string_identifier, language ){
      switch( language ){
        case "english" : return ENGLISH_LANGUAGE_STRING_CONSTANTS[string_identifier];
        default: return ENGLISH_LANGUAGE_STRING_CONSTANTS[string_identifier];
      }
    });

    hbs.registerHelper("fetchHeaderMenu", function(string_identifier){
      // console.log(HEADER_SECOND_ROW_URLS[string_identifier]);
      return HEADER_SECOND_ROW_URLS[string_identifier];
    });

    hbs.registerHelper("ifModThree", function(index, number, options){
      if(index % 3 == number)
        return options.fn(this);
      return options.inverse(this);
    });

    hbs.registerHelper("formatTime", function(time){
        format = "DD/MM/YYYY";
        return moment(time).format(format);
    });

    hbs.registerHelper("changeFormat", function(date, inFmt, outFmt){
        return moment(date, inFmt).format(outFmt);
    });

    hbs.registerHelper('isFacilityChargeInPercent', function(feeName, options){
        if (['interest_rate', 'establishment_fee', 'invoice_processing_fee', 'max_advance_invoice_percent']
                .indexOf(feeName) != -1)
            return options.fn(this);
        else
            return options.inverse(this);
    });

    hbs.registerHelper("getTime", function(time){
        return time.getTime();
    });

    hbs.registerHelper("truncate", function(string, length) {

      var len = parseInt(length);
      if(string.length > len) {
        return string.substr(0, len) + "...";
      }
      return string;
    });

    hbs.registerHelper("ifArray", function(obj, options){
        if (Array.isArray(obj))
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper("unlessArray", function(obj, options){
        if (!Array.isArray(obj))
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper("unlessObjArray", function(obj, options){
        let isArray = Array.isArray(obj);
        if (!isArray && typeof(obj) != 'object')
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper("isObjArray", function(obj, options){
        let isArray = Array.isArray(obj);
        if (isArray || typeof(obj) === 'object')
            return options.fn(this);
        return options.inverse(this);
    });


    hbs.registerHelper("mergeMapValues", function(obj, delim="\n"){
        if(typeof(obj) === 'object'){
            console.log("values are", Object.values(obj));
            return Object.values(obj).join(delim);
        }
        else
            if(Array.isArray(obj))
                return obj.join(delim);
        return "";
    });

    hbs.registerHelper("renderDirectors", function(obj, delim){
        return obj.map(function(e) { return e.values().join(delim);}).join(delim);
    });


    hbs.registerHelper("humanize", function(str){
        var frags = str.split('_');
        for (i=0; i<frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
    });

    hbs.registerHelper("extractFileName", function(str){
        return path.basename(str);
    });

    hbs.registerHelper('currencyDisp', function(num){
        return commaNumber(num);
    });

    hbs.registerHelper( 'lookupMap', function ( map, key ) {
       if(map === undefined)
            return undefined;
       return map.get(key);
    });

    hbs.registerHelper("formatDate", function(time, format){
        return moment(time).format(format);
    });

    hbs.registerHelper( 'lookup', function ( argv1, argv2 ) {
       return argv1[argv2];
    });


    hbs.registerHelper( 'dateformat', function ( date ) {
       return moment(date).format('MM/DD/YYYY');
    });

    hbs.registerHelper( 'dateFormat', function ( date , outFmt) {
       return moment(date).format(outFmt);
    });

    hbs.registerHelper( 'eachInMap', function ( map, block ) {
       var out = '';
       Object.keys( map ).map(function( prop ) {
          out += block.fn( {key: prop, value: map[ prop ]} );
       });
       return out;
    });

    hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    hbs.registerHelper("round", function(value) {
       return Math.round(value);
    });

    ViewHandler.initializePartials = function(){

        // TODO convert this to promise style recursion
        var partialsDirectory = __dirname + '/../views/partials';
        // var min_css_directory = __dirname + '/../public/stylesheets';
        registerCustomPathPartials(partialsDirectory);
        // registerCssCustomPathPartials(min_css_directory);

        function registerCustomPathPartials(objectPath) {

            if (!objectPath || objectPath.length == 0)
                return;

            if (fs.lstatSync(objectPath).isFile()) {

                var matches = /^.*(partials\/)([^.]+)\.hbs$/.exec(objectPath);
                if (!matches) {
                    return;
                }
                var completeName = matches[2];
                completeName = completeName.replace(/[ +-\/]/g, "_");
                completeName = ( "partial_" + completeName );
                var partialTemplate = fs.readFileSync(objectPath, 'utf8');
                hbs.registerPartial(completeName, partialTemplate);
                //console.log( "Partial Registered: ", completeName );
            }

            if (fs.lstatSync(objectPath).isDirectory()) {

                var fileNames = fs.readdirSync(objectPath);
                fileNames.forEach(function (fileName) {
                    registerCustomPathPartials(objectPath + '/' + fileName);
                });
            }
        }
    }

ViewHandler.renderViewWithParams = function( requestParams, res, options ){
        var view = options.view;
        delete options.view;
        requestParams.loggedIn = (options.request && options.request.user !== undefined);
        requestParams.account = (options.request && options.request.user && options.request.user.account);
        if(requestParams.loggedIn){
            requestParams.firstName =  options.request.user.firstName;
            requestParams.lastName =  options.request.user.lastName;
        }
        let layout = 'layout';
        requestParams.layout = layout;

        delete options.request;

        if(requestParams.highlightedTab == undefined)
            requestParams.highlightedTab = 'Home';
        requestParams.message =
        res.render( view, requestParams, function( err, html ){
            if(err)
                console.log("Got err", err);
            res.send(html);
        });

}

};
