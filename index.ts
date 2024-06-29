import express, { json } from 'express'
import _ from 'lodash'
import {codeRoutes } from './src/routes/code'
const app = express()
app.use(json())
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello! \nThis is a simple service which generates a code for an email and validates the same!')
});

app.use("/code", codeRoutes);

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
});