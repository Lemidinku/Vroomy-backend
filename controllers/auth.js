const Supabase = require('../db/supabase.js');

const userLoginStatic = async (req, res) => {
  const user = await Supabase.auth.signInWithPassword({email:"lemi3@gmail.com", password: "asdfasdf"})

  res.status(200).json(user);
};

const userLogout = async (req, res) => {
    const user =await Supabase.auth.signOut()
    res.status(200).json(user);
  };


const userLogin = async (req, res) => {
const { email, password } = req.body;
console.log(email,password)
  const user = await Supabase.auth.signInWithPassword({email:email, password:password})

  res.status(200).json(user);
};

const userSignup = async (req, res) => {
  const { email, password } = req.body;
    const {data: user ,error } = await Supabase.auth.signUp(
      {
      email: email,
      password: password,
        }
      );
      res.status(200).json(user);
    };
  

module.exports = {
    userLoginStatic,
    userLogin,
    userLogout,
    userSignup,
};
