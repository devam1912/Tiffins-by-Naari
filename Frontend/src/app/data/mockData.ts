import bengaliThali from './BengaliThali.png';

export interface Provider {
  id: string;
  name: string;
  chef: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  specialty: string;
}

export interface Tiffin {
  id: string;
  providerId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  type: 'Veg' | 'Non-Veg';
  calories: string;
}

export interface Subscription {
  id: string;
  providerName: string;
  planType: 'Weekly' | 'Monthly' | 'Quarterly';
  timeSlot: 'Lunch' | 'Dinner';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Paused' | 'Expired';
  price: number;
}

export const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Sita\'s Home Kitchen',
    chef: 'Sita Sharma',
    description: 'Authentic North Indian homemade meals with less oil and spices.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1080',
    rating: 4.8,
    reviews: 124,
    distance: '1.2 km',
    specialty: 'Dal Tadka & Phulka'
  },
  {
    id: '2',
    name: 'The Naari Collective',
    chef: 'Priya Iyer',
    description: 'A variety of regional Indian dishes curated by local home chefs.',
    image: bengaliThali,
    rating: 4.6,
    reviews: 89,
    distance: '2.5 km',
    specialty: 'South Indian Thali'
  },
  {
    id: '3',
    name: 'Maa Ki Rasoi',
    chef: 'Anjali Gupta',
    description: 'Purely vegetarian meals prepared with motherly love and fresh ingredients.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=1080',
    rating: 4.9,
    reviews: 210,
    distance: '0.8 km',
    specialty: 'Aloo Paratha & Curd'
  }
];

export const TIFFINS: Tiffin[] = [
  {
    id: 't1',
    providerId: '1',
    name: 'Executive North Indian Thali',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=1080',
    description: 'Dal, 2 Sabzi, 3 Rotis, Rice, Salad and Sweet.',
    price: 150,
    type: 'Veg',
    calories: '650 kcal'
  },
  {
    id: 't2',
    providerId: '1',
    name: 'Mini Healthy Meal',
    image: 'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&q=80&w=1080',
    description: 'Dal, 1 Sabzi, 2 Rotis and Salad.',
    price: 110,
    type: 'Veg',
    calories: '450 kcal'
  },
  {
    id: 't3',
    providerId: '2',
    name: 'Classic South Indian Tray',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=1080',
    description: 'Sambar, Poriyal, Rice, Curd and Papad.',
    price: 130,
    type: 'Veg',
    calories: '580 kcal'
  }
];

export const USER_INFO = {
  name: 'Rahul Sharma',
  email: 'rahul.s@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  location: 'HSR Layout, Bangalore'
};

export const MY_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 's1',
    providerName: 'Sita\'s Home Kitchen',
    planType: 'Monthly',
    timeSlot: 'Lunch',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    status: 'Active',
    price: 3500
  },
  {
    id: 's2',
    providerName: 'Maa Ki Rasoi',
    planType: 'Weekly',
    timeSlot: 'Dinner',
    startDate: '2026-01-10',
    endDate: '2026-01-17',
    status: 'Expired',
    price: 900
  }
];
