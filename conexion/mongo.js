const mongoose = require('mongoose');

// Conectar a la base de datos
mongoose.connect('mongodb+srv://jairalejandromerchan:123jair@marketplace.igqus.mongodb.net/marketplace?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Manejar eventos de conexión
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('¡Conexión a la base de datos establecida correctamente!');
});
