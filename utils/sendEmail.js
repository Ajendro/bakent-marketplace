const mailjet = require('node-mailjet').apiConnect(
  '05b631ff4c917c0e70cd81e6b439b5ff', // API Key pública
  'f279a9a744611d6cfb03255a0003e298'  // API Key privada
);

async function enviarCorreoModuloFinalizado(destinatario, asunto, mensaje, attachments ) {
  try {
    const response = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'merchanjair1@gmail.com', 
              Name: 'Jair',
            },
            To: [
              {
                Email: destinatario,
              },
            ],
            Subject: asunto,
            TextPart: mensaje,
            Attachments: attachments,
          },
        ],
      });
    console.log('Correo enviado exitosamente:', response.body);
    return response.body;
  } catch (err) {
    console.error('Error enviando correo:', err);
    throw err;
  }
}

module.exports = { enviarCorreoModuloFinalizado };
