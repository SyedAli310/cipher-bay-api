const { User } = require("../models")

const userRegister = async (req, res) => {
   const { firstName, lastName, userName, email, password } = req.body;

   if(!firstName || !lastName || !email || !password) {
      return res.status(400).json({
         error: true, 
         msg: 'Please provide all required fields for user registration'
      })
   }
   const payload = { firstName, lastName, email, password };
   if(userName) {
      payload.userName = userName;
   }

   const user = await User.create(payload);
   const token = user.createJWT();
   res
      .status(201)
      .json({
         error: false,
         msg: 'User registered successfully',
         user: { name: user.name, email: user.email },
         token,
      });
};

const userLogin = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({
         error: true,
         msg: `${!email ? 'Email' : ''} ${ !email && !password ? 'and' : ''} ${!password ? 'Password' : ''}  ${ !email && !password ? 'are' : 'is'} required`
      })
   }
   const user = await User.findOne({ email });
   if (!user) {
      return res.status(401).json({
         error: true,
         msg: 'Invalid login attempt. Please check your email'
      })
   }
   const isPasswordCorrect = await user.comparePassword(password)
   //verify passwords
   if (!isPasswordCorrect) {
      return res.status(401).json({
         error: true,
         msg: 'Invalid login attempt. Please check your password'
      })
   }
   const token = user.createJWT();
   res
      .status(200)
      .json({
         msg: 'Logged in successfully',
         user: { name: user.name, email: user.email, username: user.userName },
         token,
      });
};

module.exports = {
   userLogin,
   userRegister,
}