const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

//generar html
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async(opciones) => {

    // console.log('Usuario en fn enviar:');
    // console.log(opciones.usuario.email);

    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    // send mail with defined transport object
    let info = await transport.sendMail({
        from: '"UpTask 👻" <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text,
        html
    });
    // console.log('despies del let info');

    // const enviarEmail = util.promisify(transport.sendMail, transport);
    // return enviarEmail.call(transport, info);
}