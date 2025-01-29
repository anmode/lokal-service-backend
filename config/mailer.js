const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, GMAIL_USER, GMAIL_PASS, ETHEREAL_USER, ETHEREAL_PASS } = process.env;

let transporterPromise;

if (NODE_ENV === 'production') {
  transporterPromise = Promise.resolve(
    nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    })
  );
} else {
  if (ETHEREAL_USER && ETHEREAL_PASS) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: ETHEREAL_USER,
          pass: ETHEREAL_PASS,
        },
      })
    );
  } else {
    transporterPromise = nodemailer.createTestAccount().then((account) => {
      console.log('Ethereal account created. You can view emails at ' + account.web);
      return nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    }).catch(err => {
      console.error('Failed to create a testing account. ' + err.message);
      throw err;
    });
  }
}

module.exports = transporterPromise;
