"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { IUser } from "@/models/user.model";
import { getSocket } from "@/lib/socket";

interface IOrder{
  _id?:string
  user:string
  items:[
    {
      grocery:string,
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
  assignment?:string
  assignedDeliveryBoy?:IUser
  status:"pending" | "out of delivery" | "delivered"
  createdAt?:Date
  updatedAt?:Date
}



const AdminOrderCard = ({ order }: { order: IOrder }) => {
  const statusOptions = ["pending", "out of delivery", "delivered"];
  const [expanded, setExpanded] = useState(false);
  const [status,setStatus] = useState<string>("pending")

  const updateStatus=async(orderId:string, status:string)=>{
    try {
      const result = await axios.post(`/api/admin/update-order-status/${orderId}`,{status})
      console.log(result.data)
      setStatus(status)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    setStatus(order.status)
  },[order])

  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() == order?._id!.toString()) {
        setStatus(data.status);
      }
    });
    return () => socket.off("order-status-update");
  }, []);

  return (
    <motion.div
      key={order._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all mt-20"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          {status!=="delivered" && <span
            className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>}
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User className="text-green-600" />
              <span className="capitalize">{order?.address.fullName}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone className="text-green-600" />
              <span className="capitalize">{order?.address.mobile}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <MapPin className="text-green-600" />
              <span className="capitalize">{order?.address.fullAddress}</span>
            </p>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <CreditCard className="text-green-600" />
            <span className="capitalize">
              {order?.paymentMethod === "cod"
                ? "Cash On Delivery"
                : "Online Payment"}
            </span>
          </p>
          {order.assignedDeliveryBoy && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <UserCheck className="text-blue-600" size={18}/>
              <div className="font-semibold text-gray-800">
                <p>Assigned to : <span className="capitalize">{order.assignedDeliveryBoy.name}</span></p>
                <p className="text-xs text-gray-600">📞 +91 {order.assignedDeliveryBoy.mobile}</p>
              </div>
            </div>
            <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all">Call</a>
          </div> }
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              status === "delivered"
                ? "bg-green-100 text-green-700"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>
          {status!=="delivered" && <select 
          onChange={(e)=>updateStatus(order._id?.toString()!,e.target.value)}
          value={status}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none">
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>}
        </div>
      </div>
      <div className="border-t border-gray-200 mt-4 pt-3">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition py-3"
        >
          <span className="flex items-center gap-2">
            <Package size={16} className="text-green-600" />
            {expanded
              ? "Hide Order Items"
              : `view ${order.items.length} ${order.items.length > 1 ? "items" : "item"}`}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-green-600" />
          ) : (
            <ChevronDown size={16} className="text-green-600" />
          )}
        </button>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-3 space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-xl px-2 py-2 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(item.noOfItem)} x {item.quantity}
                      {item.unit}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  ₹{Number(item.price) * item.noOfItem}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <Truck size={16} className="text-green-600"/>
                      <span>Delivery: <span className="text-green-700 font-bolde">{status}</span></span>
                    </div>
                    <div>
                      Total: <span className="text-green-700 font-bolde">₹{order.totalAmount}</span>
                    </div>
              </div>
    </motion.div>
  );
};

export default AdminOrderCard;
