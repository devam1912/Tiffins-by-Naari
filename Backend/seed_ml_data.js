














require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const User = require("./src/modules/user/user.model");
const Provider = require("./src/modules/tiffin/provider.model");
const Menu = require("./src/modules/tiffin/menu.model");
const Order = require("./src/modules/order/order.model");


const MONGO_URI = process.env.MONGO_URI;




const MENU_DATA = {
  Monday: {
    lunch: {
      items: [
        { n: "Dal Tadka", t: "dal", p: 40 },
        { n: "Aloo Gobi", t: "sabzi", p: 45 },
        { n: "Jeera Rice", t: "rice", p: 30 },
        { n: "Roti", t: "bread", p: 10 },
        { n: "Gulab Jamun", t: "dessert", p: 25 },
      ],
      price: 150,
    },
    dinner: {
      items: [
        { n: "Rajma Masala", t: "dal", p: 50 },
        { n: "Palak Paneer", t: "sabzi", p: 60 },
        { n: "Steamed Rice", t: "rice", p: 25 },
        { n: "Butter Naan", t: "bread", p: 15 },
        { n: "Kheer", t: "dessert", p: 30 },
      ],
      price: 180,
    },
  },
  Tuesday: {
    lunch: {
      items: [
        { n: "Chana Dal", t: "dal", p: 40 },
        { n: "Paneer Butter Masala", t: "sabzi", p: 65 },
        { n: "Veg Pulao", t: "rice", p: 35 },
        { n: "Roti", t: "bread", p: 10 },
        { n: "Raita", t: "side", p: 20 },
      ],
      price: 170,
    },
    dinner: {
      items: [
        { n: "Dal Makhani", t: "dal", p: 55 },
        { n: "Mixed Veg Curry", t: "sabzi", p: 45 },
        { n: "Jeera Rice", t: "rice", p: 30 },
        { n: "Garlic Naan", t: "bread", p: 18 },
        { n: "Jalebi", t: "dessert", p: 25 },
      ],
      price: 173,
    },
  },
  Wednesday: {
    lunch: {
      items: [
        { n: "Moong Dal", t: "dal", p: 38 },
        { n: "Chole", t: "sabzi", p: 50 },
        { n: "Steamed Rice", t: "rice", p: 25 },
        { n: "Bhatura", t: "bread", p: 20 },
        { n: "Lassi", t: "side", p: 25 },
      ],
      price: 158,
    },
    dinner: {
      items: [
        { n: "Toor Dal Fry", t: "dal", p: 42 },
        { n: "Bhindi Masala", t: "sabzi", p: 45 },
        { n: "Veg Biryani", t: "rice", p: 55 },
        { n: "Roti", t: "bread", p: 10 },
        { n: "Gulab Jamun", t: "dessert", p: 25 },
      ],
      price: 177,
    },
  },
  Thursday: {
    lunch: {
      items: [
        { n: "Masoor Dal", t: "dal", p: 38 },
        { n: "Matar Paneer", t: "sabzi", p: 60 },
        { n: "Jeera Rice", t: "rice", p: 30 },
        { n: "Paratha", t: "bread", p: 15 },
        { n: "Raita", t: "side", p: 20 },
      ],
      price: 163,
    },
    dinner: {
      items: [
        { n: "Dal Tadka", t: "dal", p: 40 },
        { n: "Paneer Tikka Masala", t: "sabzi", p: 70 },
        { n: "Steamed Rice", t: "rice", p: 25 },
        { n: "Butter Naan", t: "bread", p: 15 },
        { n: "Rasmalai", t: "dessert", p: 35 },
      ],
      price: 185,
    },
  },
  Friday: {
    lunch: {
      items: [
        { n: "Chana Dal", t: "dal", p: 40 },
        { n: "Baingan Bharta", t: "sabzi", p: 45 },
        { n: "Veg Pulao", t: "rice", p: 35 },
        { n: "Roti", t: "bread", p: 10 },
        { n: "Shrikhand", t: "dessert", p: 30 },
      ],
      price: 160,
    },
    dinner: {
      items: [
        { n: "Rajma Masala", t: "dal", p: 50 },
        { n: "Kadhai Paneer", t: "sabzi", p: 65 },
        { n: "Veg Biryani", t: "rice", p: 55 },
        { n: "Garlic Naan", t: "bread", p: 18 },
        { n: "Ice Cream", t: "dessert", p: 30 },
      ],
      price: 218,
    },
  },
  Saturday: {
    lunch: {
      items: [
        { n: "Dal Fry", t: "dal", p: 40 },
        { n: "Aloo Matar", t: "sabzi", p: 42 },
        { n: "Jeera Rice", t: "rice", p: 30 },
        { n: "Roti", t: "bread", p: 10 },
        { n: "Fruit Custard", t: "dessert", p: 30 },
      ],
      price: 152,
    },
    dinner: {
      items: [
        { n: "Dal Makhani", t: "dal", p: 55 },
        { n: "Shahi Paneer", t: "sabzi", p: 70 },
        { n: "Steamed Rice", t: "rice", p: 25 },
        { n: "Butter Naan", t: "bread", p: 15 },
        { n: "Rasmalai", t: "dessert", p: 35 },
      ],
      price: 200,
    },
  },
  Sunday: {
    lunch: {
      items: [
        { n: "Dal Tadka", t: "dal", p: 40 },
        { n: "Paneer Butter Masala", t: "sabzi", p: 65 },
        { n: "Veg Biryani", t: "rice", p: 55 },
        { n: "Garlic Naan", t: "bread", p: 18 },
        { n: "Gulab Jamun", t: "dessert", p: 25 },
        { n: "Raita", t: "side", p: 20 },
      ],
      price: 223,
    },
    dinner: {
      items: [
        { n: "Rajma Masala", t: "dal", p: 50 },
        { n: "Malai Kofta", t: "sabzi", p: 70 },
        { n: "Jeera Rice", t: "rice", p: 30 },
        { n: "Butter Naan", t: "bread", p: 15 },
        { n: "Kheer", t: "dessert", p: 30 },
        { n: "Papad", t: "side", p: 10 },
      ],
      price: 205,
    },
  },
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];






function pickItems(dayName, slot) {
  const meal = MENU_DATA[dayName][slot];
  const allItems = meal.items;


  const count = Math.min(
    allItems.length,
    Math.max(2, Math.floor(Math.random() * allItems.length) + 1)
  );
  const shuffled = [...allItems].sort(() => 0.5 - Math.random());
  const picked = shuffled.slice(0, count);

  const orderItems = picked.map((i) => ({
    name: i.n,
    itemType: i.t,
    price: i.p,
    quantity: Math.random() > 0.7 ? 2 : 1,
  }));

  const totalPrice = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return { orderItems, totalPrice };
}


function generateDates(count) {
  const start = new Date("2026-01-15");
  const end = new Date("2026-07-15");
  const range = end - start;
  const dates = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + Math.random() * range);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }

  return dates.sort((a, b) => a - b);
}




async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB\n");




    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash("Test@1234", salt);

    let providerUser = await User.findOne({
      email: "sunita.sharma.dummy@gmail.com",
    });

    if (!providerUser) {
      providerUser = await User.create({
        name: "Sunita Sharma",
        email: "sunita.sharma.dummy@gmail.com",
        phone: "9876543210",
        password: hashedPw,
        role: "provider",
        isVerified: true,
      });

      await User.updateOne(
        { _id: providerUser._id },
        { password: hashedPw }
      );
      console.log("✅ Provider user created:", providerUser._id);
    } else {
      console.log("ℹ️  Provider user already exists:", providerUser._id);
    }




    let provider = await Provider.findOne({ user: providerUser._id });

    if (!provider) {
      provider = await Provider.create({
        user: providerUser._id,
        businessName: "Sunita's Home Kitchen",
        ownerName: "Sunita Sharma",
        email: "sunita.sharma.dummy@gmail.com",
        phone: "9876543210",
        address: "B-12, Shankar Nagar, Raipur, CG 492001",
        fssaiNumber: "10123456789012",
        cuisineType: "North Indian",
        pricingModel: "per_meal",
        deliverySlots: ["lunch", "dinner"],
        location: { type: "Point", coordinates: [81.6296, 21.2514] },
        isApproved: true,
        isActive: true,
        profileCompleted: true,
      });
      console.log("✅ Provider profile created:", provider._id);
    } else {
      console.log("ℹ️  Provider profile already exists:", provider._id);
    }




    let menu = await Menu.findOne({ provider: provider._id });

    if (!menu) {
      const weekMenu = Object.entries(MENU_DATA).map(([day, slots]) => ({
        day,
        lunch: {
          items: slots.lunch.items.map((i) => ({
            name: i.n,
            type: i.t,
            price: i.p,
            description: "",
          })),
          price: slots.lunch.price,
        },
        dinner: {
          items: slots.dinner.items.map((i) => ({
            name: i.n,
            type: i.t,
            price: i.p,
            description: "",
          })),
          price: slots.dinner.price,
        },
      }));

      menu = await Menu.create({
        provider: provider._id,
        weekMenu,
        isPublished: true,
        isApproved: true,
        submittedForApproval: true,
      });
      console.log("Menu created & published:", menu._id);
    } else {
      console.log("Menu already exists:", menu._id);
    }

    // ─────────────────────────────────────────────
    //  4. CREATE CUSTOMER USER
    // ─────────────────────────────────────────────
    let customer = await User.findOne({
      email: "aarav.mehta.dummy@gmail.com",
    });

    if (!customer) {
      customer = await User.create({
        name: "Aarav Mehta",
        email: "aarav.mehta.dummy@gmail.com",
        phone: "9123456780",
        password: hashedPw,
        role: "customer",
        isVerified: true,
        walletBalance: 0,
      });

      await User.updateOne(
        { _id: customer._id },
        { password: hashedPw }
      );
      console.log("Customer user created:", customer._id);
    } else {
      console.log("Customer user already exists:", customer._id);
    }




    const existingCount = await Order.countDocuments({
      user: customer._id,
      provider: provider._id,
    });

    if (existingCount >= 250) {
      console.log(
        ` Already ${existingCount} orders exist. Skipping order creation.`
      );
    } else {
      const needed = 250 - existingCount;
      const dates = generateDates(needed);

      const orders = dates.map((date) => {
        const dayName = DAYS[date.getDay()];

        const timeSlot = Math.random() < 0.6 ? "lunch" : "dinner";
        const { orderItems, totalPrice } = pickItems(dayName, timeSlot);

        const platformFee = Math.round(0.05 * totalPrice);
        const providerEarning = totalPrice - platformFee;

        return {
          user: customer._id,
          provider: provider._id,
          date,
          timeSlot,
          items: orderItems,
          totalPrice,
          amountPaid: totalPrice,
          platformFee,
          providerEarning,
          status: "completed",
          paymentStatus: "paid",
          createdAt: date,
          updatedAt: date,
        };
      });

      await Order.insertMany(orders);
      console.log(
        `${needed} orders created! (total: ${existingCount + needed})`
      );
    }




    const totalOrders = await Order.countDocuments({
      user: customer._id,
      provider: provider._id,
    });

    console.log("\n╔══════════════════════════════════════════╗");
    console.log("║         SEED COMPLETED SUCCESSFULLY      ║");
    console.log("╠══════════════════════════════════════════╣");
    console.log(`║  Provider User ID : ${providerUser._id}  `);
    console.log(`║  Provider ID      : ${provider._id}  `);
    console.log(`║  Menu ID          : ${menu._id}  `);
    console.log(`║  Customer User ID : ${customer._id}  `);
    console.log(`║  Total Orders     : ${totalOrders}  `);
    console.log("╠══════════════════════════════════════════╣");
    console.log("║  LOGIN CREDENTIALS                       ║");
    console.log("║  Password (both) : Test@1234             ║");
    console.log("║  Provider email  : sunita.sharma.dummy@gmail.com  ");
    console.log("║  Customer email  : aarav.mehta.dummy@gmail.com    ");
    console.log("╚══════════════════════════════════════════╝\n");

    process.exit(0);
  } catch (err) {
    console.error("Seed Error:", err);
    process.exit(1);
  }
}

seed();
