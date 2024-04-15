'use client'
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]


const plans = {
  '1': {
    name: 'Basic Plan',
    catalogAccess: 'Full catalog access',
    videoQuality: 'Resolution adaptable SD/HD',
    profile: 'Have up to 4 profiles',
    devices: 'Watch on 2 devices at the same time',
    price: '9.90'
  },
  '2': {
    name: 'Plus Plan',
    catalogAccess: 'Full catalog access',
    videoQuality: 'Resolution HD/4K',
    profile: 'Have up to 4 profiles',
    devices: 'Watch on 4 devices at the same time',
    price: '14.90'
  }
};

const customers = [
  {
    username: "Liam Johnson",
    email: "liam@example.com",
    status: "Approved",
    data: "2023-06-23",
    valor: plans['1'].price,
    plano: plans['1'],
  },
  {
    username: "Olivia Smith",
    email: "olivia@example.com",
    status: "Declined",
    data: "2023-06-24",
    valor: plans['2'].price,
    plano: plans['2'],
  },
  {
    username: "Noah Williams",
    email: "noah@example.com",
    status: "Approved",
    data: "2023-06-25",
    valor: plans['2'].price,
    plano: plans['2'],
  },
  {
    username: "Emma Brown",
    email: "emma@example.com",
    status: "Approved",
    data: "2023-06-26",
    valor: plans['1'].price,
    plano: plans['1'],
  },
  {
    username: "Liam Johnson",
    email: "liam@example.com",
    status: "Approved",
    data: "2023-06-27",
    valor: plans['1'].price,
    plano: plans['1'],
  },
];

const totalRevenue = customers.reduce((total, customer) => {
  if (customer.status === "Approved") {
    return total + parseFloat(customer.valor);
  }
  return total;
}, 0);

const totalSubscriptions = customers.filter(
  (customer) => customer.status === "Approved"
).length;

const totalSales = customers.length;
const activeNow = 573;


const cardData = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    value: `$${totalRevenue.toFixed(2)}`,
    percentage: "+20.1% from last month",
  },
  {
    title: "Subscriptions",
    icon: Users,
    value: `+${totalSubscriptions}`,
    percentage: "+180.1% from last month",
  },
  {
    title: "Sales",
    icon: CreditCard,
    value: `+${totalSales}`,
    percentage: "+19% from last month",
  },
  {
    title: "Active Now",
    icon: Activity,
    value: `+${activeNow}`,
    percentage: "+201 since last hour",
  },
];

export default function Dashboard() {
  
  return (
    <div className="flex h-[94vh] w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cardData.map((data, index) => (
            <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {data.title}
                </CardTitle>
                <data.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                <p className="text-xs text-muted-foreground">
                  {data.percentage}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {customers.map((customer, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>{customer.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {customer.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{customer.valor}</div>
                  <div className="ml-4 text-sm">{customer.data}</div>
                  <Badge variant={customer.status === "Approved" ? "default" : "destructive"}>
                    {customer.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
