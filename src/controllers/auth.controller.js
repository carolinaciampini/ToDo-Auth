// peticiones
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { createAccessToken } from '../libs/jwt.js'
import { TOKEN_SECRET } from '../config.js';


export const register = async(req, res) => {
  const { username, email, password } = req.body

  try {
      
    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).json(['The email already exists'])
    
    const passwordHash = await bcrypt.hash(password, 10) // encriptar

      // se crea un nuevo usuario
    const newUser = new User({
      username,
      email,
      password : passwordHash
    })
    
    const userSaved = await newUser.save(); // se guarda ese usuario

    const token = await createAccessToken({
      id: userSaved._id // le paso el valor que quiero guardar alli
    })

    res.cookie('token', token) // crea la cookie para la respuesta
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt
    } )} catch (error) {
    res.status(500).json({ message : error.message })
    }
}


export const login = async(req, res) => {

 const { email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    
    if (!userFound) return res.status(400).json({ message: 'user not found' });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if(!isMatch) return res.status(400).json({ message: 'Incorrect password' });

      
    const token = await createAccessToken({
      id: userFound._id // le paso el valor que quiero guardar alli
    })

    res.cookie('token', token) // crea la cookie para la respuesta
    
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt
    } )} catch (error) {
    res.status(500).json({ message : error.message })
    }


}


export const logout = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0)
  })
  return res.sendStatus(200);
}

export const profile = async(req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: 'user not found' });
  
  return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt
    } )
  
}


export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No esta autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    
    if (err) return res.status(401).json({ message: "No esta autorizado" })
    
    const userFound = await User.findById(user.id)
    if (!userFound) return res.status(401).json({ message: "No esta autorizado" })
    
    return res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email
    })
  })
}