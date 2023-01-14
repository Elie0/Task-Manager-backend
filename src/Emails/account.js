//  npm i --save @sendgrid/mail
const sgMail = require('@sendgrid/mail')

const sendgridAPIkey = process.env.EmailApi

sgMail.setApiKey(sendgridAPIkey)



  const sendWelcomeEmail = (email,name)=>{
    const msg = {
        to: email,
        from: 'etarou@ndu.edu.lb',
        subject: 'Welcome',
        text: 'Hello '+ name +' we are Happy to have you here!',
      };
      sgMail.send(msg).catch(err => {
        console.log(err);
      });
  }

  const sendgoodbye = (email,name)=>{
    const msg = {
        to: email,
        from: 'etarou@ndu.edu.lb',
        subject: 'Goodbye',
        text: 'Hello '+ name +' we are sad to see you leaving! kindly tell us the reason if possible!',
      };
      sgMail.send(msg).catch(err => {
        console.log(err);
      });
  }
  
  module.exports ={
    sendwelcomeEmail:sendWelcomeEmail,
    sendgoodbye:sendgoodbye,
  }

 