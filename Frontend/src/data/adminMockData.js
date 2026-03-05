export const dashboardStats = {
    totalUsers: 1250,
    totalProviders: 48,
    activeSubscriptions: 320,
    totalMenuItems: 856
};

export const mockActivities = [
    {
        id: '1',
        type: 'user_joined',
        message: 'New customer "Arjun Mehta" registered.',
        timestamp: '2 MINUTES AGO'
    },
    {
        id: '2',
        type: 'provider_registered',
        message: 'New provider "Flavors of Punjab" submitted application.',
        timestamp: '15 MINUTES AGO'
    },
    {
        id: '3',
        type: 'subscription_created',
        message: 'Subscription "Monthly Veg Thali" purchased by "Sneha Rao".',
        timestamp: '45 MINUTES AGO'
    },
    {
        id: '4',
        type: 'provider_registered',
        message: 'New provider "South Soul" submitted application.',
        timestamp: '2 HOURS AGO'
    },
    {
        id: '5',
        type: 'user_joined',
        message: 'New customer "Vikram Singh" registered.',
        timestamp: '3 HOURS AGO'
    }
];

export const mockUsers = [
    {
        id: 'u1',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@example.com',
        role: 'Customer',
        status: 'Active',
        joinedDate: '2024-03-01T10:00:00Z'
    },
    {
        id: 'u2',
        name: 'Sneha Rao',
        email: 'sneha.rao@example.com',
        role: 'Customer',
        status: 'Active',
        joinedDate: '2024-02-15T14:30:00Z'
    },
    {
        id: 'u3',
        name: 'Flavors of Punjab',
        email: 'billing@flavorsofpunjab.com',
        role: 'Provider',
        status: 'Active',
        joinedDate: '2024-03-04T09:15:00Z'
    },
    {
        id: 'u4',
        name: 'Vikram Singh',
        email: 'vikram.s@example.com',
        role: 'Customer',
        status: 'Blocked',
        joinedDate: '2024-01-20T11:45:00Z'
    },
    {
        id: 'u5',
        name: 'South Soul',
        email: 'contact@southsoul.in',
        role: 'Provider',
        status: 'Pending',
        joinedDate: '2024-03-05T08:00:00Z'
    }
];
