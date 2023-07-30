const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./model/user')
const Customer = require('./model/customer')
const BookedList = require('./model/bookedUser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendEmail = require('./sendEmail');
const generateRandomPassword = require('./generatePassword')


const JWT_SECRET = ""
mongoose.connect('')
const app = express()
app.use(cors());
app.use(bodyParser.json())


async function resetPass (userName, updatedData){
    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: userName }, 
        updatedData, 
        { new: true }  
      );
  
      console.log('Güncellenmiş kullanıcı:', updatedUser);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  }

app.post('/api/forgot-password', async (req, res) => {

    const { user, mail } = req.body
    const plainPassword = generateRandomPassword();
    const password = await bcrypt.hash(plainPassword, 10)
    const newData = {
        password: password,
      };
    sendEmail(mail, plainPassword)
    resetPass(user, newData)
 
})

app.post('/api/token-login', async (req, res) => {
    const { token } = req.body
    try {
        const user = jwt.verify(token, JWT_SECRET)
        res.json({status: 'ok'})
    }
    catch {
        res.json({ status: 'error', error: "Token Invalid" })
    }
})

app.post('/api/change-password', (req, res) => {
    const { token } = req.body
    const user = jwt.verify(token, JWT_SECRET)

    console.log(user)
    res.json({status: 'ok'})
})

app.post('/api/login', async (req,res) => {
    const {username, password } = req.body
    try {
        const user = await User.findOne({username}).lean()
        if(!user) {
            return res.json({status: 'error', error: 'Invalid username or password'})
        }
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                id: user._id,
                username: user.username
            }, JWT_SECRET)
            return res.json({status: 'ok', data: token})
        }
      } catch (error) {
        return res.json({status: 'error', error: 'Invalid username or password'})
      }
      return res.json({status: 'error', error: 'Invalid username or password'})


    
})
app.post('/api/register', async (req, res) => {

    const memberType = '0';
    const {mail, username, password: plainTextPassword} = req.body

    if (!username || typeof username !== 'string') {
        return res.json({status: 'error', error: 'Invalid Username'})
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({status: 'error', error: 'Invalid Password'})
    }

    if(plainTextPassword.length < 5) {
        return res.json({status: 'error', error: 'Password too short. Should be atleasy 6 characters'})
    }

    const password = await bcrypt.hash(plainTextPassword, 10)
    //console.log(await bcrypt.hash(password, 10))

    try {
        const response = await User.create({
            mail,
            username,
            password,
            memberType
        })
        console.log ('User Created Successfully: ', response)
        res.json({ status: 'ok' })
    } catch(error){
        if(error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Username already in use'})
        }
        throw error
    }

})


app.post('/apiv2/new-customer', async(req, res) =>{
    const {token, fullName, mailAdress, passport, phoneNumber, birthDate, userName, password, repassword } = req.body

    try {
        const user = jwt.verify(token, JWT_SECRET)
        if (user.username !== 'admin') {
            res.json({ status: 'error', error: "Bu işlemi yapabilmek için yetkiniz yok." })
            return;
        }
        const response = await Customer.create({
            fullName,
            mailAdress,
            passport,
            phoneNumber,
            birthDate,
            userName,
            password,
            repassword
        })
        console.log ('New Customer Created Successfully: ', response)
        res.json({ status: 'ok' })
    } catch (error) {
    }
})

app.post('/apiv2/get-customer-list', async(req, res) =>{
    const {token, fullName, mailAdress, passport, phoneNumber, birthDate, userName, password, repassword } = req.body

    try {
        const user = jwt.verify(token, JWT_SECRET)
        if (user.username !== 'admin') {
                res.json({ status: 'error', error: "Bu işlemi yapabilmek için yetkiniz yok." })
                return;
        }
        const userList = await Customer.find({})
        res.json({ status: 'ok', data: userList})
        console.log(userList)
    } catch (error) {
    }
})

app.post('/apiv2/get-booked-list', async(req, res) => {
    const { token } = req.body 
    try {
        const user = jwt.verify(token, JWT_SECRET)
        if (user.username !== 'admin') {
                res.json( { status: 'error', error: 'Bu işlemi yapabilmek için yetkiniz yok.'})
                return
        }
        const userList = await BookedList.find({})
        res.json({ status: 'ok', data: userList})
        console.log(userList)
    } catch (error) {
        res.json( { status: 'error', error: error})
    }
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})

