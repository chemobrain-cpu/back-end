const mongoose = require("mongoose")

mongoose.connect(process.env.DB_STRING).then(() => {
    console.log("connected to database")
})

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    /*emailVerified: {
        type: Boolean,
        default: false
    },
    numberVerified: {
        type: Boolean,
        default: false
    },*/
    phoneNumber: {
        type: String,
    },
    nid: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    address: {
        type: String
    },
    infoVerified: {
        type: Boolean,
        default: false
    },
    passportUrl: {
        type: String,
    },
    photoVerified: {
        type: Boolean,
        default: false
    },
    profilePhotoUrl: {
        type: String
    },
    walletBalance: {
        type: Number,
        default:0
    },
    totalEarn: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    accountVerified: {
        type: Boolean,
        default:false
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    },
    acountNumber: {
        type: String,
    },
    swiftNumber: {
        type: String,
    },
    taxCode: {
        type: String,
    },
    bsaCode: {
        type: String,
    },
    oneTimePassword: {
        type: String,
    },
    taxVerified: {
        type: Boolean,
        default: false
    },
    bsaVerified: {
        type: Boolean,
        default: false
    },
    
    otpVerified: {
        type: Boolean,
        default: false
    },
})

const AdminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
})

const CardSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nameOnCard: {
        type: String,
    },
    cardNumber: {
        type: String,
    },
    cvv: {
        type: String,
    },
    expiry: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})

const DepositSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    depositId: {
        type: String,
    },
    dateOfDeposit: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
        default: '0'
    },
    status: {
        type: String,
    },
    photoProof: {
        type: String,
    },
    uploadPhotoProof: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})

const TokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 8000,

    }

})

const RecoverTokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 6000,

    }

})

const PhoneTokenSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 6000,

    }

})


const WithdrawSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    withdrawId: {
        type: String,
    },
    amount: {
        type: String,
    },
    country: {
        type: String,
    },
    nameOfBank: {
        type: String,
    },
    accountName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    stateName: {
        type: String
    },
    bankAddress: {
        type: String
    },
    routeNumber: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    },
    dateOfWithdrawal: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },


})

const TransferSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    transferId: {
        type: String,
    },
    dateOfTransfer: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    routeNumber: {
        type: String,
    },
    reason: {
        type: String,
    },
    cardNumber: {
        type: String,
    },
    accountName: {
        type: String,
    },
    nameOfBank: {
        type: String,
    },
    nameOfCountry: {
        type: String,
    },
    status: {
        type: String,
    },
    medium: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})


const HistorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
    },
    id:{
        type: String,
    },
    transactionType: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    routeNumber: {
        type: String,
    },
    reason: {
        type: String,
    },
    accountName: {
        type: String,
    },
    nameOfBank: {
        type: String,
    },
    nameOfCountry: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})

const BeneficiariesSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    accountName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    bankType: {
        type:String,
    },
    bankName:{
        type: String,
    },
    cardNumber:{
        type: String,
    },
    nameOfCountry:{
        type: String,
    },
    routeNumber:{
        type: String,
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"}
})


const NotificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
    },
    text: {
        type: String,
    },
    type:{
        type: String,
    },
    date:{
        type:String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})



let User = new mongoose.model("User", userSchema)
let Token = new mongoose.model("Token", TokenSchema)
let RecoverToken = new mongoose.model("RecoverToken", RecoverTokenSchema)
let PhoneToken = new mongoose.model("PhoneToken", PhoneTokenSchema)
let Card = new mongoose.model("Card", CardSchema)
let Deposit = new mongoose.model("Deposit", DepositSchema)
let Admin = new mongoose.model("Admin", AdminSchema)
let Withdraw = new mongoose.model("Withdraw", WithdrawSchema)
let Transfer = new mongoose.model("Transfer", TransferSchema)
let History = new mongoose.model("History", HistorySchema)
let Beneficiaries = new mongoose.model('Beneficiaries', BeneficiariesSchema)
let Notification = new mongoose.model('Notification',NotificationSchema)

module.exports.User = User
module.exports.Token = Token
module.exports.RecoverToken = RecoverToken
module.exports.PhoneToken = PhoneToken
module.exports.Card = Card
module.exports.Deposit = Deposit
module.exports.Admin = Admin
module.exports.Transfer = Transfer
module.exports.Withdraw = Withdraw
module.exports.History = History
module.exports.Beneficiaries = Beneficiaries
module.exports.Notification = Notification