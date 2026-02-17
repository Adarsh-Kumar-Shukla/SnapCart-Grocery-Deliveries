import React from "react";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import GeoUpdater from "@/components/GeoUpdater";
import Grocery, { IGrocery } from "@/models/grocery.models";
import Footer from "@/components/Footer";

const Home = async (props: { searchParams: Promise<{ q: string }> }) => {
  const searchParams = await props.searchParams
  await connectDb();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const isComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");

  if (isComplete) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  let groceryList:IGrocery[]=[]

  if(user.role==="user"){
    if(searchParams.q){
      try {
        groceryList=await Grocery.find({
        $or:[
          {name:{ $regex: searchParams?.q || "", $options:"i"}},
          {category: {$regex: searchParams?.q || "", $options:"i"}},
        ]        
      })
      } catch (error) {
        groceryList=await Grocery.find({})
      }
    }
    else{
      groceryList=await Grocery.find({})
    }
  }

  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role == "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer/>
    </>
  );
};

export default Home;
