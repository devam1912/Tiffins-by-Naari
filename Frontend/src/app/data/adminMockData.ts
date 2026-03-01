export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Provider';
  status: 'Active' | 'Blocked' | 'Inactive';
  joinedDate: string;
}

export interface Provider {
  id: string;
  name: string;
  contact: string;
  email: string;
  location: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  joinedDate: string;
  menuItems: number;
}

export interface MenuItem {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  provider: string;
  planType: 'Daily' | 'Weekly' | 'Monthly';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  price: number;
}

export interface Activity {
  id: string;
  type: 'user_joined' | 'provider_registered' | 'subscription_created' | 'menu_added';
  message: string;
  timestamp: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2026-01-15',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    phone: '+91 98765 43211',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2026-01-20',
  },
  {
    id: '3',
    name: 'Anjali Patel',
    email: 'anjali.patel@email.com',
    phone: '+91 98765 43212',
    role: 'Customer',
    status: 'Blocked',
    joinedDate: '2026-01-10',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43213',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2026-02-01',
  },
  {
    id: '5',
    name: 'Neha Reddy',
    email: 'neha.reddy@email.com',
    phone: '+91 98765 43214',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2026-02-05',
  },
  {
    id: '6',
    name: 'Arjun Malhotra',
    email: 'arjun.m@email.com',
    phone: '+91 98765 43215',
    role: 'Customer',
    status: 'Inactive',
    joinedDate: '2025-12-20',
  },
];

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: "Lakshmi's Kitchen",
    contact: '+91 99887 76655',
    email: 'lakshmi.kitchen@email.com',
    location: 'Koramangala, Bangalore',
    approvalStatus: 'Approved',
    joinedDate: '2026-01-05',
    menuItems: 12,
  },
  {
    id: '2',
    name: 'Savitri Homemade',
    contact: '+91 99887 76656',
    email: 'savitri.homemade@email.com',
    location: 'Indiranagar, Bangalore',
    approvalStatus: 'Approved',
    joinedDate: '2026-01-08',
    menuItems: 8,
  },
  {
    id: '3',
    name: 'Kamala Tiffins',
    contact: '+91 99887 76657',
    email: 'kamala.tiffins@email.com',
    location: 'HSR Layout, Bangalore',
    approvalStatus: 'Pending',
    joinedDate: '2026-02-10',
    menuItems: 0,
  },
  {
    id: '4',
    name: 'Radha Home Food',
    contact: '+91 99887 76658',
    email: 'radha.food@email.com',
    location: 'Whitefield, Bangalore',
    approvalStatus: 'Pending',
    joinedDate: '2026-02-12',
    menuItems: 0,
  },
  {
    id: '5',
    name: "Meera's Authentic Meals",
    contact: '+91 99887 76659',
    email: 'meera.meals@email.com',
    location: 'Jayanagar, Bangalore',
    approvalStatus: 'Approved',
    joinedDate: '2026-01-18',
    menuItems: 15,
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Dal Makhani with Rice',
    provider: "Lakshmi's Kitchen",
    price: 120,
    category: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    available: true,
  },
  {
    id: '2',
    name: 'Chole Bhature',
    provider: "Lakshmi's Kitchen",
    price: 100,
    category: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    available: true,
  },
  {
    id: '3',
    name: 'Sambar Rice Bowl',
    provider: 'Savitri Homemade',
    price: 90,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1589301773859-cb58f1605e8d?w=400',
    available: true,
  },
  {
    id: '4',
    name: 'Paneer Butter Masala Thali',
    provider: "Lakshmi's Kitchen",
    price: 150,
    category: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    available: true,
  },
  {
    id: '5',
    name: 'Masala Dosa',
    provider: 'Savitri Homemade',
    price: 80,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
    available: true,
  },
  {
    id: '6',
    name: 'Rajma Chawal',
    provider: "Meera's Authentic Meals",
    price: 110,
    category: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    available: true,
  },
  {
    id: '7',
    name: 'Idli Sambar (4 pcs)',
    provider: 'Savitri Homemade',
    price: 70,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
    available: true,
  },
  {
    id: '8',
    name: 'Aloo Paratha with Curd',
    provider: "Meera's Authentic Meals",
    price: 95,
    category: 'North Indian',
    imageUrl: 'https://images.unsplash.com/photo-1606491048248-4c1e5d7e77c1?w=400',
    available: false,
  },
  {
    id: '9',
    name: 'Vegetable Biryani',
    provider: "Lakshmi's Kitchen",
    price: 130,
    category: 'Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    available: true,
  },
  {
    id: '10',
    name: 'Pongal with Vada',
    provider: 'Savitri Homemade',
    price: 85,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1606491048248-4c1e5d7e77c1?w=400',
    available: true,
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@email.com',
    provider: "Lakshmi's Kitchen",
    planType: 'Monthly',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    status: 'Active',
    price: 3000,
  },
  {
    id: '2',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.k@email.com',
    provider: 'Savitri Homemade',
    planType: 'Weekly',
    startDate: '2026-02-08',
    endDate: '2026-02-15',
    status: 'Active',
    price: 800,
  },
  {
    id: '3',
    userName: 'Vikram Singh',
    userEmail: 'vikram.singh@email.com',
    provider: "Meera's Authentic Meals",
    planType: 'Daily',
    startDate: '2026-02-15',
    endDate: '2026-02-16',
    status: 'Active',
    price: 120,
  },
  {
    id: '4',
    userName: 'Neha Reddy',
    userEmail: 'neha.reddy@email.com',
    provider: "Lakshmi's Kitchen",
    planType: 'Monthly',
    startDate: '2026-01-15',
    endDate: '2026-02-15',
    status: 'Expired',
    price: 3000,
  },
  {
    id: '5',
    userName: 'Anjali Patel',
    userEmail: 'anjali.patel@email.com',
    provider: 'Savitri Homemade',
    planType: 'Weekly',
    startDate: '2026-02-01',
    endDate: '2026-02-08',
    status: 'Cancelled',
    price: 800,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'user_joined',
    message: 'Neha Reddy joined as a new customer',
    timestamp: '2026-02-05 10:30 AM',
  },
  {
    id: '2',
    type: 'subscription_created',
    message: 'Vikram Singh subscribed to Daily plan with Meera\'s Authentic Meals',
    timestamp: '2026-02-15 09:15 AM',
  },
  {
    id: '3',
    type: 'provider_registered',
    message: 'Radha Home Food registered as a new provider',
    timestamp: '2026-02-12 02:45 PM',
  },
  {
    id: '4',
    type: 'menu_added',
    message: 'Lakshmi\'s Kitchen added Vegetable Biryani to menu',
    timestamp: '2026-02-10 11:20 AM',
  },
  {
    id: '5',
    type: 'provider_registered',
    message: 'Kamala Tiffins registered as a new provider',
    timestamp: '2026-02-10 03:30 PM',
  },
  {
    id: '6',
    type: 'subscription_created',
    message: 'Rajesh Kumar subscribed to Weekly plan with Savitri Homemade',
    timestamp: '2026-02-08 04:20 PM',
  },
];

export const dashboardStats = {
  totalUsers: 156,
  totalProviders: 23,
  activeSubscriptions: 47,
  totalMenuItems: 142,
};
