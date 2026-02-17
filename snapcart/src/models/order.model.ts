import mongoose from "mongoose";

export interface IOrder{
  _id?:mongoose.Types.ObjectId
  user:mongoose.Types.ObjectId
  items:[
    {
      grocery:mongoose.Types.ObjectId,
      name:string,
      price:string,
      quantity:string,
      unit:string,
      image:string,
      noOfItem:number,
    }
  ],
  isPaid:boolean
  totalAmount:number
  paymentMethod:"cod" | "online"
  address:{
    fullName:string,
    mobile:string,
    city:string,
    state:string,
    pincode:string,
    fullAddress:string,
    latitude:number,
    longitude:number
  }
  assignment?:mongoose.Types.ObjectId
  assignedDeliveryBoy?:mongoose.Types.ObjectId
  status:"pending" | "out of delivery" | "delivered"
  createdAt?:Date
  updatedAt?:Date
  deliveryOtp:string | null
  deliveryOtpVerification:boolean
  deliveredAt:Date
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    items:[
      {
        grocery:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Grocery",
          required:true
        },
        name:String,
        price:String,
        quantity:String,
        unit:String,
        image:String,
        noOfItem:Number,
      }
    ],
    paymentMethod:{
      type:String,
      enum:["cod","online"],
      default:"cod"
    },
    isPaid:{
      type:Boolean,
      default:false,
    },
    totalAmount:{
      type:Number,
    },
    address:{
      fullName:String,
      mobile:String,
      city:String,
      state:String,
      pincode:String,
      fullAddress:String,
      latitude:Number,
      longitude:Number
    },
    assignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    },
    assignedDeliveryBoy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    status:{
      type:String,
      enum:["pending", "out of delivery", "delivered"],
      default:"pending"
    },
    deliveryOtp:{
      type:String,
      default:null
    },
    deliveryOtpVerification:{
      type:Boolean,
      default:false,
    },
    deliveredAt:{
      type:Date
    }
  },{timestamps:true}
)

const Order = mongoose.models.Order || mongoose.model("Order",orderSchema)

export default Order