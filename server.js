require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./express');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to DB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});