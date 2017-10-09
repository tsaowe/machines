const Koa = require('koa2');
const fs = require('fs');
const app = new Koa();

const serve = require('koa-static');
app.use(serve('.'));
app.use(serve(__dirname + '/'));

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'denali'
});
connection.connect();

// response 
/*
 create table machines(
 id SERIAL not null,
 host varchar(200) null,
 owner varchar(200) null,
 team varchar(200) null,
 os varchar(200) null,
 cpu varchar(200) null,
 memory varchar(200) null,
 user varchar(200) null,
 password varchar(200) null
 );

 alter table machines add column type varchar(200) null after team;

 */

app.use(async(ctx) => {
    if (ctx.path === '/insert') {
        let command = ctx.query.query;
        let result = await new Promise((r, j)=> {
            connection.query(command, {}, (a, b, c)=> {
                if (a) {
                    r(-1);
                } else {
                    r(1);
                }
            });
        });
        if (result > 0) {
            ctx.status = 200;
        } else {
            ctx.status = 500;
        }
    } else if (ctx.path === '/delete') {
        let {id} = ctx.query;
        let command = 'delete from machines where id = ' + id;
        let result = await new Promise((r, j)=> {
            connection.query(command, {}, (a, b, c)=> {
                if (a) {
                    r(-1);
                } else {
                    r(1);
                }
            });
        });
        if (result > 0) {
            ctx.status = 200;
        } else {
            ctx.status = 500;
        }
    } else if (ctx.path === '/update') {
        let {id, key, value} = ctx.query;
        let command = `update machines set ${key} = '${value}' where id = ${id};`;
        let result = await new Promise((r, j)=> {
            connection.query(command, {}, (a, b, c)=> {
                if (a) {
                    r(-1);
                } else {
                    r(1);
                }
            });
        });
        if (result > 0) {
            ctx.status = 200;
        } else {
            ctx.status = 500;
        }

    } else if (ctx.path === '/list') {
        ctx.type = 'text/json';
        var results = await new Promise((r, j)=> {
            connection.query('select * from machines;', {}, (error, list)=> {
                r(list);
            });
        });
        ctx.body = JSON.stringify(results);
    }
});

app.listen(3000);


/***

 npm install forever -g
 forever start index.js

 */