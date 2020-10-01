
const mongoose = require('mongoose');
const {Storage} = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env['CLOUD_BUCKET'];
const storage = new Storage({
  projectId: process.env['GCLOUD_PROJECT'],
  keyFilename : process.env['GOOGLE_APPLICATION_CREDENTIALS']
});
const bucket = storage.bucket(CLOUD_BUCKET);
const mailgun = require("mailgun-js");
const DOMAIN = "mg.seawisecapital.com";
const mg = mailgun({apiKey: process.env['MAIL_API_KEY'], domain: DOMAIN});
var commaNumber = require('comma-number');


exports.cleanupKeys = (data) => {
	let newMap = {};
	Object.keys(data).forEach(function(key, index){
		newMap[key.replace(".", "")+""] = data[key];
	});
	return newMap;
}

exports.objToStrMap = (obj) => {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
};

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

exports.sendUploadToGCS  = (req, res, next) => {
  if (!req.files) {
    return null;
  }
  req.cloudStorageObject = [];
  req.cloudStoragePublicUrl = {};
  console.log("here in gcs upload");
  return Promise.all(
  	  req.files.map((f) => {
  	  	return new Promise((resolve, reject) => {
		  const gcsname = req.user.account.id + "-" + req.invoiceCode + "/" + f.originalname;
		  const file = bucket.file(gcsname);

		  const stream = file.createWriteStream({
		    metadata: {
		      contentType: f.mimetype
		    },
		    resumable: false
		  });

		  stream.on('error', (err) => {
		    //req.file.cloudStorageError = err;
		    console.log('got err', err);
		    reject(err);
		  });

		  stream.on('finish', () => {
		    req.cloudStorageObject.push(gcsname);
		    file.makePublic().then(() => {
		      let cloudStoragePublicUrl = getPublicUrl(gcsname);
		      req.cloudStoragePublicUrl[f.originalname] = cloudStoragePublicUrl;
		      resolve(cloudStoragePublicUrl);
		    });
		  });

		  stream.end(f.buffer);
		});
  	  }));
};


exports.getResponse = (status,message,results) => {
    return {status : status || '',message : message || '',results : results || []};
}

exports.get_probe_headers = () => {
	return {'x-api-key': process.env.PROBE_API_KEY, 'x-api-version' : process.env.PROBE_API_VERSION};
};

exports.currencyDisp = (num) => {
	return commaNumber(num);
}

exports.humanize = (str) => {
	var frags = str.split('_');
    for (var i=0; i<frags.length; i++) {
    	frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

exports.validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.truncate = (string, n) => {
	return (string.length > n) ? string.substr(0, n-1) + '&hellip;' : string;
};

exports.sendEmail = (targetEmail, subject, template, params ) => {
	const data = {
		from: "Seawise Admin<manish@mg.seawisecapital.com>",
		to: targetEmail || process.env["ADMIN_NOTIFICATION_EMAIL"],
		subject: subject || "New Invoice Uploaded",
		template: template || "new-invoice",
		'h:X-Mailgun-Variables': JSON.stringify(params)
	};

	mg.messages().send(data, function (error, body) {
		console.log(body, "Got error \n", error);
	});
};