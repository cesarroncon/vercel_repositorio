const express = require('express')
const app = express()

app.use("/", (req,res)=>{
    res.send("Server is runningg.");
})

app.listen(5000,console.log("Server started on PORT 5000"));

const admin = require('firebase-admin');
const serviceAccount = require('./creds.json');

// Inicialize o SDK do Firebase Admin com as credenciais do arquivo JSON
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iscf-d8e85-default-rtdb.europe-west1.firebasedatabase.app/' // Substitua pelo URL do seu banco de dados em tempo real
});

// Obtenha uma referência para o Realtime Database
const db = admin.database();

// Função para ler um registro
async function readRecord(recordId) {
  try {
    // Obtenha uma vez o valor do registro no caminho 'users/${recordId}'
    const snapshot = await db.ref(`users/${recordId}`).once('value');
    // Retorna o valor do snapshot
    return snapshot.val();
  } catch (error) {
    // Trate os erros, se houver
    console.error('Erro ao ler registro:', error);
    throw error;
  }
}

// ID do registro que você deseja ler
const recordId = 'example_record_id';

// Chame a função para ler o registro e imprima o resultado
readRecord(recordId)
  .then((record) => {
    console.log('Registro lido:', record);
    // Acessando os dados de aceleração
    const accelData = record.accel;
    // Iterando sobre os subníveis do nó 'accel'
    Object.keys(accelData).forEach((key) => {
      const accelEntry = accelData[key];
      console.log('Timestamp:', accelEntry.timestamp);
      console.log('X:', accelEntry.x);
      console.log('Y:', accelEntry.y);
      console.log('Z:', accelEntry.z);
    });
  })
  .catch((error) => {
    console.error('Erro ao ler registro:', error);
  });


time.sleep(1.0)
