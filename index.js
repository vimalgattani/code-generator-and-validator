import express, { json } from 'express'
import _ from 'lodash'
const app = express()
app.use(json())
const port = 3000

const tokens = [];

const getRandomGeneratedCode = () => {
    return Math.random().toString().substr(2, 6);
}

app.get('/', (req, res) => {
    res.send('Hello! \nThis is a simple service which generates a code for an email and validates the same!')
});

app.post('/initiate', (req, res) => {
    const {email} = req.body;
    const currentTime = new Date();
    const currentTimeinMillis = currentTime.getTime();
    const code = getRandomGeneratedCode();
    tokens.push({
        email, code, validTill: currentTimeinMillis + 300000, isValidated: false
    })
    console.log({tokens})
    res.send({
        email,
        code,
    });
});

app.post('/validate', (req, res) => {
    const {email, code} = req.body;
    const token = _.find(tokens, {email: email, code: code});
    console.log({tokens, token})
    if(_.isNil(token)) {
        return res.send("No token generated yet!");
    }
    if(token.isValidated) {
        return res.send("Illegal request.");
    }
    const currentTime = new Date();
    const currentTimeinMillis = currentTime.getTime();
    if(token.validTill < currentTimeinMillis) {
        return res.send("Token expired.");
    }
    token.isValidated = true;
    console.log({tokens});
    res.send("Validation successful!");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});