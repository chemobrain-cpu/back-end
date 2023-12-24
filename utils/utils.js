const jwt = require("jsonwebtoken")
require("dotenv").config()
const { User,Admin } = require("../database/databaseConfig")

const secret = process.env.SECRET_KEY
module.exports.generateAcessToken =  (email) => {
    let token = jwt.sign({ email: email }, secret, { expiresIn: "500h" })
    return token
}


module.exports.verifyUser = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let user = await User.findOne({ email: decodedToken.email })

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let admin = await Admin.findOne({ email: decodedToken.email })
        req.admin = admin
        console.log(req.Admin)
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.message = err.message
        return next(error)
    }
}

module.exports.verifyTransactionToken = async (token) => {
    const decodedToken = jwt.verify(token, secret)
    return decodedToken.email
}


module.exports.verifyEmailTemplate = (verifyUrl, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">digitamon.cloud VERIFICATION </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">To verify the email to your digitamon account,click the verification link below</p>

    <p style={{ margin-bottom: 40px; width: 100%; text-align:center; }}>
        <a style=" color: blue; font-size: .8rem;text-align:center" href='${verifyUrl}'>
        ${verifyUrl}
        </a>
    </p>

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>



    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">${email}</p>

        </div>



    </div>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}


module.exports.passwordResetTemplate = (resetUrl, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">digitamon.cloud PASSWORDRESET </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">To reset the password to your digitamon account,click the RESET link below</p>

    <p style={{ margin-bottom: 40px; width: 100%; text-align:center; }}>
        <a style=" color: blue; font-size: .8rem;text-align:center" href='${resetUrl}'>
        ${resetUrl}
        </a>
    </p>

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>



    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">${email}</p>

        </div>



    </div>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}


module.exports.upgradeTemplate = (fundBalance, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">digitamon.cloud Credited </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your digitamon account has  been credited with $ ${fundBalance} to start trading with. Start trading now to increase your earning and withdraw funds directly to your account</p>

    

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>



    <div style=" margin-bottom: 30px; width: 100%; display: flex; flex-direction: row ">
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">Email</p>

        </div>
        <div style=" width: 50%; display: flex; flex-direction: column; align-items: center">

            <p style=" margin-bottom: 30px; font-size: 1rem ;width: 100%;text-align:center">${email}</p>

        </div>



    </div>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align:center; font-weight: 400 ">Happy trading !!</h2>


</div>`

}


module.exports.removeSpaces = (numStr)=>{
    let res = ''
    for(let char of numStr){
        if(char === ' ') continue
        res+=char
    }
    return res
}


module.exports.TransferTemplate = (amount,accountNumber,name,account,date) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> DEBIT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">You have been debited the sum of $${amount} from your  account ${accountNumber} to ${name} with account number  ${account} on ${date}</p>

    

    






</div>`

}


module.exports.CreditTemplate = (amount,date) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> CREDIT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your Account have been credited with the sum of $${amount}  on ${date}</p>

    






</div>`

}


module.exports.Approval = () => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> ACCOUNT APPROVAL</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your Account has been approaved .You can now make transfer, deposit and withdrawal !!</p>

    






</div>`

}

module.exports.DebitTemplate = (accountNumber,amount,date) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> ACCOUNT APPROVAL</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your Account ${accountNumber} have been debited the sum of $${amount}  on ${date}</p>

    
</div>`

}

module.exports.OneTimePasswordTemplate = (password) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your one time password is ${password}</p>

</div>`

}


module.exports.SendEmailTemplate = (email) => {
    return `
<div>
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">${email}</p>
</div>`

}








