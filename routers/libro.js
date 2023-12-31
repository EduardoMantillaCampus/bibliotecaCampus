import dotenv from "dotenv";
import mysql from "mysql2";
import {Router} from "express";
import validateLibro from "../middleware/validateLibro.js";

dotenv.config();
let storageLibro = Router();

let con = undefined;
storageLibro.use((req, res, next)=>{
    let conex= JSON.parse(process.env.MY_DB);
    con = mysql.createPool(conex);
    next();
})

storageLibro.get("/", (req, res)=>{
    let sql = 'select l.titulo as titulo, a.nombre as autor, e.nombre as editorial from libro as l inner join autor as a on a.id_autor=l.id_autor inner join editorial as e on e.id_editorial=l.id_editorial;';
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})
storageLibro.get("/disponibles/", (req, res)=>{
    let sql = 'select libro.titulo as titulo_libro, aut.nombre as autor, estado_libro.nombre as estado from libro inner join estado_libro on estado_libro.id_estado= libro.id_estado inner join autor aut on aut.id_autor=libro.id_autor where libro.id_estado=1;';
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})

storageLibro.get("/prestados/", (req, res)=>{
    let sql = 'select libro.titulo as libro, prestamo.fecha_devolucion from libro inner join prestamo on prestamo.id_libro=libro.id_libro where prestamo.estado="Prestado"';
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})

storageLibro.get("/autor/", validateLibro, (req, res)=>{

    let {nombre} = req.query;
    let sql = `select libro.titulo, autor.nombre from libro inner join autor on autor.id_autor=libro.id_autor where autor.nombre='${nombre}'`;
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})
storageLibro.get("/pag500", (req, res)=>{
    let sql = 'select libro.titulo as libro, autor.nombre as autor, libro.num_paginas as cantPaginas from libro inner join autor on autor.id_autor=libro.id_autor where num_paginas>500;';
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})

storageLibro.get("/reserva", (req, res)=>{
    let sql = 'select * from libro where libro.id_estado =4';
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})

storageLibro.get("/tokio", (req, res)=>{
    let sql = `select * from libro where libro.titulo like '%tokio%'`;
    con.query(sql, (err,data, fil)=>{
        if(err){
            res.status(500).send("Error en la solicitud"+err);
        }else{
            if(Object.entries(data).length === 0){
                res.json({"Mensaje":"No se encontro registro en la base de datos"});
            }else{
                res.send(data);
            }
        }
    })

})

export default storageLibro;