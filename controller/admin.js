const express = require("express")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { generateAcessToken, DebitTemplate, Approval, SendEmailTemplate } = require('../utils/utils')
const { Admin, User, Deposit, Transfer, History, Beneficiaries, Notification } = require("../database/databaseConfig");
const { CreditTemplate } = require('../utils/utils');
const Mailjet = require('node-mailjet')
let request = require('request');
const NanoId = require('nano-id');





module.exports.getUserFromJwt = async (req, res, next) => {
   try {
      let token = req.headers["header"]

      if (!token) {
         throw new Error("a token is needed ")
      }
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
      const admin = await Admin.findOne({ email: decodedToken.email })

      if (!admin) {
         //if user does not exist return 404 response
         return res.status(404).json({
            response: "user has been deleted"
         })
      }

      return res.status(200).json({
         response: {
            admin: admin,
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { email, password, secretKey } = req.body

      //check if the email already exist
      let adminExist = await Admin.findOne({ email: email })

      if (adminExist) {
         let error = new Error("user is already registered")

         return next(error)
      }

      if (secretKey !== 'bank') {
         let error = new Error("secret key does not match")

         return next(error)
      }
      //hence proceed to create models of admin and token
      let newAdmin = new Admin({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedAdmin = await newAdmin.save()
      if (!savedAdmin) {
         //cannot save user
         let error = new Error("an error occured")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: savedAdmin,
            token: token,
            expiresIn: '500',
         }
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

//sign in user with different response pattern
module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body

      let adminExist = await Admin.findOne({ email: email })

      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //check if password corresponds
      if (adminExist.password !== password) {
         let error = new Error("incorrect password")
         return next(error)
      }

      let token = generateAcessToken(email)

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: {
            admin: adminExist,
            token: token,
            expiresIn: '500',
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.fetchUsers = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //fetching all user

      let users = await User.find()

      if (!users) {
         let error = new Error("an error occured")
         return next(error)
      }
      return res.status(200).json({
         response: users
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.deleteUser = async (req, res, next) => {
   try {
      let email = req.params.id

      let adminExist = await Admin.findOne({ email: req.admin.email })

      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }
      //delete specific user
      let deletedUser = await User.deleteOne({ email: email })

      if (!deletedUser) {
         let error = new Error("an error occured")
         return next(error)
      }
      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: deletedUser
      })
   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}





module.exports.updateUser = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })

      let {
         emailVerified,
         numberVerified,
         phoneNumber,
         infoVerified,
         photoVerified,
         totalEarn,
         totalSpent,
         accountVerified,
         passportUrl,
         acountNumber,
         swiftNumber,
         taxCode,
         bsaCode,
         taxVerified,
         bsaVerified,
         oneTimePassword,
         otpVerified,
         firstName,
         lastName,
         email,
         password,
         address,
         country,
         nid,
         state,
         profilePhotoUrl,
         walletBalance

      } = req.body

      console.log(req.body)


      if (!adminExist) {

         let error = new Error("admin does not exist")
         return next(error)
      }
      //finding the user to update
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         let error = new Error("user does not exits")
         return next(error)
      }

      let initialAccountVerification = userExist.accountVerified

      let initialBalance = userExist.walletBalance
      userExist.phoneNumber = phoneNumber ? phoneNumber : ''
      userExist.infoVerified = infoVerified
      userExist.photoVerified = photoVerified
      userExist.walletBalance = walletBalance ? walletBalance : ''
      userExist.totalEarn = totalEarn ? totalEarn : ''
      userExist.totalSpent = totalSpent ? totalSpent : ''
      userExist.accountVerified = accountVerified
      userExist.firstName = firstName ? firstName : '',
         userExist.lastName = lastName ? lastName : '',
         userExist.email = email ? email : '',
         userExist.password = password ? password : '',
         userExist.address = address ? address : '',
         userExist.country = country ? country : '',
         userExist.nid = nid ? nid : '',
         userExist.state = state ? state : '',
         userExist.profilePhotoUrl = profilePhotoUrl ? profilePhotoUrl : '',
         userExist.passportUrl = passportUrl,
         userExist.acountNumber = acountNumber
      userExist.swiftNumber = swiftNumber
      userExist.taxCode = taxCode ? taxCode : ''
      userExist.bsaCode = bsaCode ? bsaCode : ''
      userExist.taxVerified = taxVerified
      userExist.bsaVerified = bsaVerified
      userExist.oneTimePassword = oneTimePassword ? oneTimePassword : ''
      userExist.otpVerified = otpVerified

      let savedUser = await userExist.save()
      let currentDate = new Date();
      let fourYearDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getUTCDate()}`

      if (initialBalance != savedUser.walletBalance && Number(initialBalance) < Number(savedUser.walletBalance)) {
         // Create mailjet send email
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "digitamon@digitamon.com",
                        "Name": "digitamon"
                     },
                     "To": [
                        {
                           "Email": `${savedUser.email}`,
                           "Name": `${savedUser.firstName}`
                        }
                     ],

                     "Subject": "CREDIT",
                     "TextPart": `Your Account have been credited with the sum of $${Number(savedUser.walletBalance) - Number(initialBalance)}  on ${fourYearDate}`,
                     "HTMLPart": CreditTemplate(Number(savedUser.walletBalance) - Number(initialBalance), fourYearDate),
                  }
               ]
            })

         if (!request) {
            let error = new Error("an error occurred")
            return next(error)
         }
      }


      if (initialBalance != savedUser.walletBalance && Number(initialBalance) < Number(savedUser.walletBalance)) {


         //start sending sms
         let data = {
            "to": savedUser.phoneNumber,
            "from": "Coincap",
            "sms": `Your Account have been credited with the sum of $${Number(savedUser.walletBalance) - Number(initialBalance)}  on ${fourYearDate}`,
            "type": "plain",
            "api_key": process.env.TERMII_API_KEY,
            "channel": "generic",
         };
         var options = {
            'method': 'POST',
            'url': 'https://api.ng.termii.com/api/sms/send',
            'headers': {
               'Content-Type': ['application/json', 'application/json']
            },
            body: JSON.stringify(data)
         };
         request(options, function (error, response) {
            if (error) {
               console.log(error)
            }
            console.log(response);
         });


      }






      if (initialAccountVerification == false && accountVerified == 'true') {
         console.log('xxxxx APPROVAL XXXXXX')

         // Create mailjet send email
         const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
         )
         const request = await mailjet.post("send", { 'version': 'v3.1' })
            .request({
               "Messages": [
                  {
                     "From": {
                        "Email": "digitamon@digitamon.com",
                        "Name": "digitamon"
                     },
                     "To": [
                        {
                           "Email": `${savedUser.email}`,
                           "Name": `${savedUser.firstName}`
                        }
                     ],

                     "Subject": "ACCOUNT APPROVAL",
                     "TextPart": `Your Account has been approved`,
                     "HTMLPart": Approval(),
                  }
               ]
            })


         if (!request) {
            let error = new Error("an error occurred")
            return next(error)
         }




      }


      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: savedUser
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

//deposit sectiion
module.exports.fetchDeposits = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }

      let deposits = await Deposit.find()
      if (!deposits) {
         let error = new Error("an error occurred")
         return next(error)
      }

      console.log(deposits)
      console.log(deposits)
      console.log(deposits)


      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: deposits
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.updateDeposit = async (req, res, next) => {
   let {
      amount,
      uploadPhotoProof,
      isVerified,
      _id,
      depositId,
      status,
      user,
      dateOfDeposit
   } = req.body



   let depositExist = await Deposit.findOne({ _id: _id })

   if (!depositExist) {
      let error = new Error("deposits not found")
      return next(error)
   }

   let initialStatus = depositExist.status

   //update deposit

   depositExist.dateOfDeposit = dateOfDeposit
   depositExist.amount = amount
   depositExist.status = status


   let savedDeposit = await depositExist.save()

   if (!savedDeposit) {
      let error = new Error("user not found")
      return next(error)
   }

   let depositor = await User.findOne({ _id: user })
   if (!depositor) {
      let error = new Error("user not found")
      return next(error)
   }

   if (status === 'active' && depositExist.status !== initialStatus) {
      // Create mailjet send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                            "Email": "coincaps@coincaps.cloud",
                            "Name": "coincaps"
                        },
                  "To": [
                     {
                        "Email": `${depositor.email}`,
                        "Name": `${depositor.firstName}`
                     }
                  ],

                  "Subject": "CREDIT ALERT",
                  "TextPart": `Your Account have been credited with the sum of $${amount}  on ${dateOfDeposit}`,
                  "HTMLPart": CreditTemplate(amount, dateOfDeposit),
               }
            ]
         })


      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }








   }

   //start sending sms
   let data = {
      "to": depositor.phoneNumber,
      "from": "Coincap",
      "sms": `Your Account have been credited with the sum of $${amount}  on ${dateOfDeposit}`,
      "type": "plain",
      "api_key": process.env.TERMII_API_KEY,
      "channel": "generic",
   };
   var options = {
      'method': 'POST',
      'url': 'https://api.ng.termii.com/api/sms/send',
      'headers': {
         'Content-Type': ['application/json', 'application/json']
      },
      body: JSON.stringify(data)
   };
   request(options, function (error, response) {
      if (error) {
         console.log(error)
      }
      console.log(response);
   });

   return res.status(200).json({
      response: savedDeposit
   })
}

//transfer section
module.exports.fetchTransfers = async (req, res, next) => {
   try {
      let adminExist = await Admin.findOne({ email: req.admin.email })
      if (!adminExist) {
         let error = new Error("admin does not exist")
         return next(error)
      }

      let transfers = await Transfer.find()
      if (!transfers) {
         let error = new Error("an error occurred")
         return next(error)
      }



      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: transfers
      })
   } catch (error) {
      console.log(error)
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}

module.exports.updateTransfers = async (req, res, next) => {
   let {
      _id,
      dateOfTransfer,
      amount,
      accountNumber,
      routeNumber,
      reason,
      accountName,
      nameOfBank,
      nameOfCountry,
      status,
      medium,
      user,
   } = req.body


   let transferExist = await Transfer.findOne({ _id: _id })

   if (!transferExist) {
      let error = new Error(" not found")
      return next(error)
   }

   const id = NanoId(10);

   let initialStatus = transferExist.status

   //update deposit
   transferExist.dateOfTransfer = dateOfTransfer
   transferExist.amount = amount
   transferExist.accountNumber = accountNumber
   transferExist.routeNumber = routeNumber
   transferExist.reason = reason
   transferExist.accountName = accountName
   transferExist.nameOfBank = nameOfBank
   transferExist.nameOfCountry = nameOfCountry
   transferExist.status = status
   transferExist.medium = medium

   let savedTransfer = await transferExist.save()

   if (!savedTransfer) {
      let error = new Error("an error occured")
      return next(error)
   }

   let transferer = await User.findOne({ _id: user })

   if (!transferer) {
      let error = new Error("user not found")
      return next(error)
   }

   if (status === 'active' && savedTransfer.status !== initialStatus) {
      // Create mailjet send email
      /*const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                            "Email": "coincaps@coincaps.cloud",
                            "Name": "coincaps"
                        },
                  "To": [
                     {
                        "Email": `${transferer.email}`,
                        "Name": `${transferer.firstName}`
                     }
                  ],

                  "Subject": "DEBIT ALERT",
                  "TextPart": `Your Account ${transferer.acountNumber} has been debited with the sum of $${amount}  on ${dateOfTransfer}`,
                  "HTMLPart": DebitTemplate(transferer.acountNumber, amount, dateOfTransfer),
               }
            ]
         })

      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }*/


      //check if notification for this transferId exist and create notification if not 

      const newNotification = new Notification({
         _id: new mongoose.Types.ObjectId(),
         name: accountName,
         type: `confirmation`,
         user: transferer,
      })


      let savedNotification = await newNotification.save()
      if (!savedNotification) {
         let error = new Error("an error occured")
         return next(error)
      }
   }


   //start sending sms
   let data = {
      "to": transferer.phoneNumber,
      "from": "Coincap",
      "sms": `Your Account ${transferer.accountNumber} has been debited with the sum of $${amount}  on ${dateOfTransfer}`,
      "type": "plain",
      "api_key": process.env.TERMII_API_KEY,
      "channel": "generic",
   };
   var options = {
      'method': 'POST',
      'url': 'https://api.ng.termii.com/api/sms/send',
      'headers': {
         'Content-Type': ['application/json', 'application/json']
      },
      body: JSON.stringify(data)
   };
   request(options, function (error, response) {
      if (error) {
         console.log(error)
      }
      console.log(response);
   });






   return res.status(200).json({
      response: savedTransfer
   })

}


module.exports.sendEmail = async (req, res, next) => {
   let {email,reciever} = req.body

   const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                            "Email": "coincaps@coincaps.cloud",
                            "Name": "coincaps"
                        },
                  "To": [
                     {
                        "Email":reciever,
                        "Name":reciever
                     }
                  ],

                  "Subject": "MESSAGE",
                  "TextPart": `${email}`,
                  "HTMLPart": SendEmailTemplate(email),
               }
            ]
         })


      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }

      //at this point,return jwt token and expiry alongside the user credentials
      return res.status(200).json({
         response: 'email sent'
      })

   return

   let transferExist = await Transfer.findOne({ _id: _id })
   if (!transferExist) {
      let error = new Error(" not found")
      return next(error)
   }

   const id = NanoId(10);

   let initialStatus = transferExist.status

   //update deposit
   transferExist.dateOfTransfer = dateOfTransfer
   transferExist.amount = amount
   transferExist.accountNumber = accountNumber
   transferExist.routeNumber = routeNumber
   transferExist.reason = reason
   transferExist.accountName = accountName
   transferExist.nameOfBank = nameOfBank
   transferExist.nameOfCountry = nameOfCountry
   transferExist.status = status
   transferExist.medium = medium

   let savedTransfer = await transferExist.save()

   if (!savedTransfer) {
      let error = new Error("an error occured")
      return next(error)
   }

   let transferer = await User.findOne({ _id: user })

   if (!transferer) {
      let error = new Error("user not found")
      return next(error)
   }

   if (status === 'active' && savedTransfer.status !== initialStatus) {
      // Create mailjet send email
      /*const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
      )
      const request = await mailjet.post("send", { 'version': 'v3.1' })
         .request({
            "Messages": [
               {
                  "From": {
                            "Email": "coincaps@coincaps.cloud",
                            "Name": "coincaps"
                        },
                  "To": [
                     {
                        "Email": `${transferer.email}`,
                        "Name": `${transferer.firstName}`
                     }
                  ],

                  "Subject": "DEBIT ALERT",
                  "TextPart": `Your Account ${transferer.acountNumber} has been debited with the sum of $${amount}  on ${dateOfTransfer}`,
                  "HTMLPart": DebitTemplate(transferer.acountNumber, amount, dateOfTransfer),
               }
            ]
         })

      if (!request) {
         let error = new Error("an error occurred")
         return next(error)
      }*/


      //check if notification for this transferId exist and create notification if not 

      const newNotification = new Notification({
         _id: new mongoose.Types.ObjectId(),
         name: accountName,
         type: `confirmation`,
         user: transferer,
      })


      let savedNotification = await newNotification.save()
      if (!savedNotification) {
         let error = new Error("an error occured")
         return next(error)
      }
   }


   //start sending sms
   let data = {
      "to": transferer.phoneNumber,
      "from": "Coincap",
      "sms": `Your Account ${transferer.accountNumber} has been debited with the sum of $${amount}  on ${dateOfTransfer}`,
      "type": "plain",
      "api_key": process.env.TERMII_API_KEY,
      "channel": "generic",
   };
   var options = {
      'method': 'POST',
      'url': 'https://api.ng.termii.com/api/sms/send',
      'headers': {
         'Content-Type': ['application/json', 'application/json']
      },
      body: JSON.stringify(data)
   };
   request(options, function (error, response) {
      if (error) {
         console.log(error)
      }
      console.log(response);
   });






   return res.status(200).json({
      response: savedTransfer
   })

}





