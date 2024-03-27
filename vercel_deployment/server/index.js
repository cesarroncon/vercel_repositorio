//INICIALIZADOR DO SERVER**********************************
const visualiser = require('visualiser');
const express = require('express')
const app = express()
const cors = require('cors'); //necessario para comunicação entre portos/dominios

app.use(cors()); //necessario para comunicação entre portos/dominios
app.listen(5000,console.log("Server started on PORT 5000"));
//FIM DO INICIALIZADOR DO SERVER******************************


//LIGAÇÃO COM FIREBASE********************************
var admin = require("firebase-admin");

var serviceAccount = require("./creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iscf-d8e85-default-rtdb.europe-west1.firebasedatabase.app"
});

//Verificar o status da conexão com o Firebase Realtime Database***************************
var db = admin.database();
var connectedRef = db.ref(".info/connected");
connectedRef.on("value", function(snapshot) {
  if (snapshot.val() === true) {
    console.log("Conexão com o Firebase Realtime Database estabelecida com sucesso.");
  } else {
    console.log("Conexão com o Firebase Realtime Database perdida.");
  }
});
//FIM DO CODIGO DE LIGAÇÃO COM FIREBASE**********************************



  
  //LE O ULTIMO INPUT NA FIREBASE*************************************
  //V1
  /*async function readLastAccelData() {
    try {
        // Get a reference to the main path and order by key (timestamp)
        const snapshot = await db.ref('accel').orderByKey().limitToLast(1).once('value');
        
        // Check if the snapshot is not null
        const record = snapshot.val();
        if (record !== null) {
            // Return the last 'accel' data
            return record;
        } else {
            console.error('No acceleration data found.');
            return null;
        }
    } catch (error) {
        // Handle errors, if any
        console.error('Error reading acceleration data:', error);
        throw error;
    }
}*/
async function readLastAccelData() {
    try {
        // Get a reference to the main path and order by key (timestamp)
        const snapshot = await db.ref('accel').orderByKey().limitToLast(1).once('value');
        
        // Check if the snapshot is not null
        const record = snapshot.val();
        if (record !== null) {
            // Return the last 'accel' data
            const accelData = record[Object.keys(record)[0]]; // Get the first (and only) object in the record
            const { timestamp, x, y, z } = accelData; // Destructure the values from accelData object
            return { timestamp, x, y, z }; // Return an object with separated values
        } else {
            console.error('No acceleration data found.');
            return null;
        }
    } catch (error) {
        // Handle errors, if any
        console.error('Error reading acceleration data:', error);
        throw error;
    }
}
//FIM DE LE O ULTIMO INPUT NA FIREBASE*************************************

//CHAMAMOS A FUNCAO REPETIDAMENTE 
function logLastRecord() {
    //RETORNA NA CONSOLA OS VALORES DO FIREBASE***************
    readLastAccelData()
        .then((record) => {
            console.log('Last record:', record);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//TODOS OS SEGUNDOS
setInterval(logLastRecord, 1000); // 1000 milliseconds = 1 second

//RETORNA NO SERVIDOR OS VALORES DO FIREBASE*******************
app.get("/", async (req, res) => {
    try {
        // Chama a função para ler os últimos dados de aceleração
        const accelData = await readLastAccelData();
        // Verifica se os dados estão disponíveis
        if (accelData) {
            // Envia os dados de aceleração como resposta
            //res.send(accelData);
            res.json(accelData);
        } else {
            // Se nenhum dado estiver disponível, envie uma mensagem apropriada
            res.send('Nenhum dado de aceleração encontrado.');
        }
    } catch (error) {
        // Se ocorrer um erro, envie uma resposta de erro
        res.status(500).send('Erro ao ler os dados de aceleração.');
    }
});
//FIM DE RETORNA NO SERVIDOR OS VALORES DO FIREBASE*******************

/*app.get('/line', async (req, res) => {
    try {
    const accelData = await readLastAccelData();
    
    let inst = new visualiser({width : 1200, height : 800});
    const data = [{x: accelData.x, y: 10, name: "one"}]
    let line = inst.line({data: data, min_el: -10, max_el: -9, max_render: 10, 
          lineColor: "red", pointRadius: 0});
    line.legend({data: ["X"], colours: "red"});
    res.send(inst.visualise());
    } catch (error) {
        res.status(500).send('Erro ao ler os dados de aceleração.');
    }
  });

  app.get('/line', async (req, res) => {
    try {
        const accelData = await readLastAccelData();

        if (accelData) {
            const data = [
                { x: accelData.timestamp, y: accelData.x, name: "Y" }
                // Adicione outros dados, se necessário, para os eixos x ou séries diferentes
            ];

            const minY = 0; // Valor mínimo do eixo y
            const maxY = 1; // Valor máximo do eixo y

            let inst = new visualiser({ width: 1200, height: 800 });
            let line = inst.line({
                data: data,
                min_el: data[0].x,
                max_el: data[0].x + 1,
                min_ey: minY,
                max_ey: maxY,
                max_render: 20,
                lineColor: "blue", // Mudando a cor da linha para azul para o eixo y
                pointRadius: 0
            });

            line.legend({ data: ["Y"], colours: "blue" }); // Legenda para o eixo y

            res.send(inst.visualise());
        } else {
            res.send('Nenhum dado de aceleração encontrado.');
        }
    } catch (error) {
        res.status(500).send('Erro ao ler os dados de aceleração.');
    }
});

*/












