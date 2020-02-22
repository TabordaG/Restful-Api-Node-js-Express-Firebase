const functions = require('firebase-functions');
const admin = require('firebase-admin') ;
const firebaseHelper = require('firebase-functions-helper');
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')

const config = {
    apiKey: "AIzaSyCWcjGn4lc7d4DB-1dBeXZdi-A4xXN3q_8",
    authDomain: "projetopds-72fa1.firebaseapp.com",
    databaseURL: "https://projetopds-72fa1.firebaseio.com",
    projectId: "projetopds-72fa1",
    storageBucket: "projetopds-72fa1.appspot.com",
    messagingSenderId: "934903834935"
};
admin.initializeApp(config);

const db = admin.firestore();

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(cors());
app.use(cors());

const contactsCollection = 'usuarios';

exports.main = functions.https.onRequest(main);

class Contact {
    constructor(email, password, name, office, userid) {
        this.email = email,
        this.password = password,
        this.name = name,
        this.office = office,
        this.userid = userid
    }
}

class Process {
    constructor(advogado, oab, autor, cep, cidade, comarca, contato, cpf, data, protocolo, uf, vara) {
        this.advogado = advogado,
        this.oab = oab,
        this.autor = autor,
        this.cep = cep,
        this.comarca = comarca,
        this.contato = contato,
        this.cpf = cpf,
        this.data = data,
        this.protocolo = protocolo,
        this.uf = uf,
        this.vara = vara,
        this.cidade = cidade
    }
}

// Add new contact
app.post('/contacts', async (req, res) => {
    try {
        const contact = new Contact();
        contact.email = req.body['email'];
        contact.password = req.body['password'];
        contact.name = req.body['name'];
        contact.office = req.body['office'];
        contact.userid = req.body['userid'];

        const user = JSON.parse(JSON.stringify(contact));
        const newDoc = await firebaseHelper.firestore
            .createDocumentWithID(db, contactsCollection, String(contact.userid), user);
        res.status(201).send(user);
    } catch (error) {
        var type = typeof user;
        res.status(400).send(user)
    }        
})

// router.post('/upload',upload.single('file'),function(req, res, next) {
//     console.log(req.file);
//     if(!req.file) {
//         res.status(500);
//         return next(err);
//     }
//     res.send(req.file);
//     //json({ fileUrl: 'http://192.168.0.7:3000/images/' + req.file.filename });
// })

// Add new Archive
app.post('/processes', async (req, res) => {
    try {
        const archives = new Process();
        archives.advogado = req.body['advogado'];
        archives.oab = req.body['oab'];
        archives.autor = req.body['autor'];
        archives.cep = req.body['cep'];
        archives.cidade = req.body['cidade'];
        archives.comarca = req.body['comarca'];
        archives.contato = req.body['contato'];
        archives.cpf = req.body['cpf'];
        archives.data = req.body['data'];
        archives.protocolo = req.body['protocolo'];
        archives.uf = req.body['uf'];
        archives.vara = req.body['vara'];

        const archive = JSON.parse(JSON.stringify(archives));
        const newDoc = await firebaseHelper.firestore
            .createNewDocument(db, "processos", archive);
        res.status(201).send(archive);
    } catch (error) {
        var type = typeof archive;
        res.status(400).send(archive)
    }        
})

app.get('/processes', (req, res) => {
    firebaseHelper.firestore
        .backup(db, "processos")
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get processes: ${error}`));
})

app.get('/processes/:processId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, "processos", req.params.processId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get contact: ${error}`));
})

// Update new contact
app.patch('/contacts/:contactId', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, contactsCollection, req.params.contactId, req.body);
    res.status(204).send(`Update a new contact: ${updatedDoc}`);
})

// View a contact
app.get('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, contactsCollection, req.params.contactId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get contact: ${error}`));
})

// View all contacts
app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get contacts: ${error}`));
})

// Delete a contact 
app.delete('/contacts/:contactId', async (req, res) => {
    const deletedContact = await firebaseHelper.firestore
        .deleteDocument(db, contactsCollection, req.params.contactId);
    res.status(204).send(`Contact is deleted: ${deletedContact}`);
})








// app.get('/get', cors(), async (req, res, next) => {
//     try {
//         const noteSnapshot = await db.collection('usuarios').get();
//         const notes = [];
//         noteSnapshot.forEach((doc) => {
//             notes.push({
//                 id: doc.id,
//                 data: doc.data()
//             });
//         });
//         res.json(notes);
//     } catch(e) {
//         res.send("Error");
//     }
// });

// app.get('/get/:id', cors(), async(req, res, next) => {
//     try {
//         const id = req.params.id;
//         if (!id) throw new Error('id is blank');
//         const note = await db.collection('usuarios').doc(id).get();
//         if (!note.exists) {
//             throw new Error('note does not exists');
//         }
//         res.json({
//             id: note.id,
//             data: note.data()
//         });
//     } catch(e) {
//         next(e);
//     }
// });

// app.post('/login', cors(), async(req, res, next) => {
//     try {
//         const text = req.body.text;
//         if (!text) throw new Error('Text is blank');
//         const userid = text["userid"];
//         delete text["userid"];
//         const data = { text };
//         const ref = await db.collection('usuarios').doc(userid).set(data);
//         res.json({
//             id: ref.id,
//             data
//         });
//     } catch(e) {
//         res.send(e);
//     }
// });

// app.post('/create', cors(), async (req, res, next) => {
//     try {
//         const text = req.body.text;
//         if (!text) throw new Error('Text is blank');
//         const data = { text };
//         const ref = await db.collection('usuarios').add(data);
//         res.json({
//             id: ref.id,
//             data
//         });
//     } catch(e) {
//         res.send(e);
//     }
// });

// app.put('/put/:id', cors(), async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const text = req.body.text;
//         if (!id) throw new Error('id is blank');
//         if (!text) throw new Error('Text is blank');
//         const data = { text };
//         const ref = await db.collection('usuarios').doc(id).set(data, { merge: true });
//         res.json({
//             id,
//             data
//         });
//     } catch(e) {
//         next(e);
//     }
// });

// app.delete('/delete/:id', cors(), async(req, res, next) => {
//     try {
//         const id = req.params.id;
//         if (!id) throw new Error('id is blank');
//         await db.collection('usuarios').doc(id).delete();
//         res.json({
//             id
//         });
//     } catch(e) {
//         next(e);
//     }
// });

//app.use('/home', route);
//app.use('/second', create);
//app.use('/home', put);
//app.use('/home', getid);

//module.exports = app;
//app.use(cors());
//exports.app = functions.https.onRequest(app);