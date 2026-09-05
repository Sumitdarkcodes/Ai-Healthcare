const User = require ("../models/user.model");

const bcrypt = require ("bcryptjs");


const registerUser = async (req,res) =>{


    const { email, name, password } = req.body;
      
    //  Did the user provide all required information?

    if (!email || !name || !password)
    {
        return res.status(400).json({

            message : "Email, Name and Password are required "
        });
    }

    // Does this email already exist in MongoDB?

    const existingUser = await User.findOne({ email });

    if (existingUser)
    {
        return res.status(409).json ({

            message : "User with this email already exists "
        });
    }

    // Now the next step is password hashing.

    const hashedPassword = await bcrypt.hash(password,10);

    // now we are creating account for registerUser 

    const newAccount = new User ({

        name,
        email,
        password : hashedPassword
    });

    await newAccount.save();

    return res.status(201).json({

        message : "User registered successfully ",

        userId : newAccount._id
    });


};

module.exports = {registerUser};